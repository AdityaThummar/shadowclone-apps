import { Alert, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BaseText,
  Card,
  Header,
  Input,
  ListItemWithImage,
  PlusButton,
  PrimaryButton,
  ScreenWrapper,
  Scroll,
  UserCardHalf,
} from '@components';
import { commonStyles, hp, wp } from '@styles';
import { RootRouteProps, useNav } from '../../helper';
import { SelectionState } from '../../zustand/SelectionState';
import { GroupDetailsType, UserProfileType } from '../../api/types';
import { AuthState, UsersState } from '../../zustand';
import {
  createNewRequest,
  markAsPaid,
  PayRequestDiffAmountType,
  PayRequestItemAPIPaylod,
  PayRequestItemType,
  updateRequest,
} from '../../api/payRequests';
import { LoadingState } from '@zustand';
import { useRoute } from '@react-navigation/native';
import { RequestState } from '../../zustand/RequestState';

export const AddEditRequestScreen = () => {
  const { navigate, goBack, push } = useNav();
  const { params } = useRoute<RootRouteProps<'AddEditRequestScreen'>>();
  const viewOnly = !!params?.viewOnly;
  const edit = !!params?.edit;

  const { user } = AuthState();
  const {
    selectedGroups,
    selectedMemebersForNew,
    setSelectedMemebersForNew,
    setSelectedGroups,
  } = SelectionState();
  const { friends } = UsersState();
  const { setLoader } = LoadingState();
  const { requests, selfRequests } = RequestState();

  const [requestTitle, setRequestTitle] = useState<string>();
  const [requestAmount, setRequestAmount] = useState<string>('');
  const [diffAmounts, setDiffAmounts] = useState<PayRequestDiffAmountType>({});
  const [payRequestItem, setPayRequestItem] = useState<PayRequestItemType>();

  const selectedMembers: UserProfileType[] = useMemo(() => {
    return selectedMemebersForNew?.filter((_) =>
      viewOnly ? true : _.uid !== user?.userProfile?.uid,
    );
  }, [selectedMemebersForNew, user, viewOnly]);

  const goToAddItem = useCallback((type: 'group' | 'member' = 'member') => {
    navigate('SelectItemScreen', {
      type: type === 'group' ? 'select_groups' : 'select_req_members',
      header: `Select ${type}`,
    });
  }, []);

  const goToEditRequest = useCallback(() => {
    if (payRequestItem?.id) {
      push('AddEditRequestScreen', {
        edit: true,
        id: payRequestItem?.id,
        viewOnly: false,
      });
    }
  }, [payRequestItem]);

  const onRemoveGroup = useCallback(
    (_gp: GroupDetailsType) => {
      const finalGroups = [...selectedGroups]?.filter(
        (_item) => _item.id !== _gp.id,
      );
      setSelectedGroups(finalGroups);

      const finalMembers: UserProfileType[] = [];
      selectedMemebersForNew?.map((_m) => {
        const shouldInclude =
          (finalGroups?.findIndex(
            (_g) => _g.member?.findIndex((_gm) => _gm.uid === _m.uid) !== -1,
          ) !== -1 ||
            friends.findIndex((_f) => _f.uid === _m.uid) !== -1) &&
          _m.uid !== user?.userProfile?.uid;
        if (shouldInclude) {
          finalMembers.push(_m);
        }
      });
      setSelectedMemebersForNew(finalMembers);
    },
    [selectedGroups, selectedMemebersForNew],
  );

  const onRemoveMembers = useCallback(
    (_m: UserProfileType) => {
      const finalMembers = [...selectedMembers]?.filter(
        (_item) => _item.uid !== _m.uid,
      );
      setSelectedMemebersForNew(finalMembers);

      const finalGroups: GroupDetailsType[] = [];
      selectedGroups?.map((_gp) => {
        const shouldInclude =
          _gp?.member?.findIndex(
            (_gm) =>
              finalMembers?.findIndex((_fm) => _fm.uid === _gm.uid) !== -1,
          ) !== -1;
        if (shouldInclude) {
          finalGroups.push(_gp);
        }
      });
      setSelectedGroups(finalGroups);
    },
    [selectedGroups, selectedMemebersForNew],
  );

  const renderSelectedGroups = useCallback(
    (item: GroupDetailsType) => {
      const goToGroupInfo = () =>
        push('ViewProfileScreen', {
          group: true,
          groupDetails: item,
        });

      return (
        <ListItemWithImage
          item={item}
          enableRemove={!viewOnly}
          onPressRemove={onRemoveGroup}
          onPress={goToGroupInfo}
        />
      );
    },
    [selectedGroups],
  );

  const renderMembers = useCallback(
    (_member: UserProfileType) => {
      const onClearInput = () => {
        if (diffAmounts?.[_member?.uid]) {
          const newObj = { ...diffAmounts };
          delete newObj?.[_member.uid];
          setDiffAmounts(newObj);
        } else {
          setDiffAmounts({ ...diffAmounts, [_member.uid]: '0' });
        }
      };
      const onChangeText = (text: string) => {
        const finalDiff = {
          ...diffAmounts,
          [_member.uid]: Number(text) ? text : '0',
        };
        setDiffAmounts(finalDiff);
        if (Object.keys(diffAmounts).length === selectedMembers?.length) {
          setRequestAmount(finalDiff?.[selectedMembers?.[0].uid]);
        }
      };
      const onBlurInput = () => {
        if (diffAmounts?.[_member?.uid]) {
          const finalDiff = {
            ...diffAmounts,
            [_member.uid]: Number(diffAmounts?.[_member?.uid]).toString(),
          };
          setDiffAmounts(finalDiff);
        }
      };

      const extraProps = {
        ...(viewOnly
          ? {
              inputProps: {
                editable: !viewOnly,
                allowClear: !viewOnly,
              },
            }
          : {
              actions: [
                {
                  title: 'Remove',
                  onPress: onRemoveMembers,
                },
              ],
            }),
      };

      return (
        <UserCardHalf
          item={_member}
          input
          value={diffAmounts?.[_member?.uid] ?? requestAmount}
          onClearInput={onClearInput}
          onChangeText={onChangeText}
          onBlurInput={onBlurInput}
          {...extraProps}
        />
      );
    },
    [selectedMemebersForNew, selectedMembers, requestAmount, diffAmounts],
  );

  const onClearRequest = useCallback(() => {
    setRequestAmount('');
    setDiffAmounts({});
  }, []);

  const onCreateRequest = useCallback(
    async (edit: boolean = false) => {
      if (!requestAmount || !Number(requestAmount)) {
        Alert.alert('Oops', 'Please enter request amount !!');
        return;
      }
      if (!selectedMembers || selectedMembers?.length < 1) {
        Alert.alert('Oops', 'Please select atleast one member !!');
        return;
      }
      if (user?.userProfile?.uid) {
        const PayRequestItemAPIPaylod: PayRequestItemAPIPaylod = {
          created_by: user?.userProfile?.uid,
          date: new Date().toString(),
          members: selectedMembers?.map((_m) => _m.uid),
          requestAmount,
          diffAmounts,
          groups: selectedGroups?.map((_g) => _g.id),
          title: requestTitle,
          ...(edit ? { id: payRequestItem?.id } : {}),
        };
        setLoader(edit ? 'Updating request' : 'Creating request');
        const functionRef = edit ? updateRequest : createNewRequest;
        const response = await functionRef(PayRequestItemAPIPaylod);
        setLoader('');
        if (response?.success) {
          goBack();
        }
      }
    },
    [
      selectedMembers,
      requestAmount,
      requestTitle,
      selectedGroups,
      diffAmounts,
      user,
      payRequestItem,
      edit,
    ],
  );

  const canEdit = useMemo(
    () =>
      viewOnly
        ? payRequestItem?.created_by?.uid === user?.userProfile?.uid
        : true,
    [viewOnly, payRequestItem, user?.userProfile],
  );

  useEffect(() => {
    if (params?.id) {
      const data = [...requests, ...selfRequests]?.find(
        (_re) => _re.id === params.id,
      );
      setRequestTitle(data?.title ?? '');
      setRequestAmount(data?.requestAmount ?? '');
      setDiffAmounts(data?.diffAmounts ?? {});
      if (data?.members) {
        setSelectedMemebersForNew(data?.members);
      }
      if (data?.groups) {
        setSelectedGroups(data?.groups);
      }
      setPayRequestItem(data);
    }
    return () => {
      // setSelectedMemebersForNew([]);
      // setSelectedGroups([]);
    };
  }, [params?.id, requests, selfRequests]);

  const Spacer = <View style={{ height: hp(1) }} />;

  return (
    <ScreenWrapper>
      <Header
        title={
          viewOnly
            ? 'Request details'
            : edit
            ? 'Edit Pay Request'
            : 'New Pay Request'
        }
      />
      <Scroll>
        {viewOnly ? (
          <Card
            style={[
              {
                padding: wp(5),
                gap: hp(1),
              },
            ]}
          >
            <BaseText sizeLargeExtra bold center>
              {requestTitle
                ? requestTitle
                : payRequestItem?.date
                ? new Date(payRequestItem?.date).toDateString()
                : ''}
            </BaseText>
            {requestTitle && (
              <BaseText medium sizeSmall center>
                {payRequestItem?.date
                  ? new Date(payRequestItem?.date).toDateString()
                  : new Date().toDateString()}
              </BaseText>
            )}
          </Card>
        ) : (
          <View
            style={[
              commonStyles.rowItemsCenter,
              {
                marginVertical: 10,
              },
            ]}
          >
            <Input
              label='Title'
              placeholder='Ex. Pizza, Pasta etc'
              containerStyle={[{ flex: 2.5 }]}
              value={requestTitle}
              onChangeText={setRequestTitle}
              editable={!viewOnly}
              allowClear={!viewOnly}
            />
            <Input
              label='Amount'
              placeholder='₹XX'
              containerStyle={[commonStyles.flex]}
              value={requestAmount}
              onChangeText={setRequestAmount}
              onClear={onClearRequest}
              editable={!viewOnly}
              allowClear={!viewOnly}
            />
          </View>
        )}
        {Spacer}
        {viewOnly && (
          <>
            <Header title={`Requested by`} sizeBig disableBack />
            <UserCardHalf item={payRequestItem?.created_by} />
          </>
        )}
        {Spacer}
        <Header
          title={`Groups (${selectedGroups?.length})`}
          sizeBig
          disableBack
          rightComponent={
            !viewOnly && (
              <PlusButton
                name='circle-with-plus'
                onPress={goToAddItem.bind(this, 'group')}
              />
            )
          }
        />
        {selectedGroups?.length > 0 ? (
          selectedGroups.map(renderSelectedGroups)
        ) : (
          <BaseText regular sizeRegular style={{ marginHorizontal: wp(2.5) }}>
            No group selected
          </BaseText>
        )}
        {Spacer}
        <Header
          title={`Members (${selectedMemebersForNew?.length})`}
          sizeBig
          disableBack
          rightComponent={
            !viewOnly && (
              <PlusButton
                name='circle-with-plus'
                onPress={goToAddItem.bind(this, 'member')}
              />
            )
          }
        />
        {selectedMembers?.length > 0 ? (
          <Scroll horizontal>{selectedMembers.map(renderMembers)}</Scroll>
        ) : (
          <BaseText regular sizeRegular style={{ marginHorizontal: wp(2.5) }}>
            No member selected
          </BaseText>
        )}

        {canEdit && (
          <PrimaryButton
            title={
              viewOnly
                ? 'Edit Request'
                : edit
                ? 'Update Request'
                : 'Create Request'
            }
            style={{ marginTop: 15 }}
            onPress={
              viewOnly
                ? goToEditRequest
                : edit
                ? onCreateRequest.bind(this, true)
                : onCreateRequest.bind(this, false)
            }
          />
        )}
      </Scroll>
    </ScreenWrapper>
  );
};
