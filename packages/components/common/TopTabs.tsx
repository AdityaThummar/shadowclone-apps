import React, { useCallback } from 'react';
import { View } from 'react-native';
import { BaseText, BaseTextStyle } from './text';
import { themedStyles } from './wrapper';
import { Touchable } from './Touchable';
import { ViewStyles } from 'packages/types/common/commonTypes';

export type TabItemType = {
  name: string;
};

export type TopTabsProps = {
  tabs: TabItemType[];
  selectedTab: TabItemType;
  onPressTab?: (t: TabItemType) => void;
  tabTextStyle?: BaseTextStyle;
  selectedTabTextStyle?: BaseTextStyle;
  tabContainerStyle?: ViewStyles;
  selectedTabContainerStyle?: ViewStyles;
  style?: ViewStyles;
};

export const TopTabs = (props: TopTabsProps) => {
  const {
    tabs,
    onPressTab,
    selectedTab,
    tabTextStyle = {},
    selectedTabTextStyle = {},
    tabContainerStyle = {},
    style = {},
  } = props;

  const styles = s();

  const renderTab = useCallback(
    (tabItem: TabItemType) => {
      const isSelected = selectedTab.name === tabItem.name;

      return (
        <Touchable
          style={[styles.tabContainer, tabContainerStyle]}
          onPress={onPressTab?.bind(this, tabItem)}
          key={tabItem?.name}
        >
          <BaseText
            style={[
              ...[styles.tabTextStyle, tabTextStyle],
              ...[
                isSelected ? styles.selectedTabTextStyle : {},
                selectedTabTextStyle,
              ],
            ]}
            semibold
            sizeMedium
          >
            {tabItem.name}
          </BaseText>
        </Touchable>
      );
    },
    [selectedTab, styles],
  );

  return <View style={[styles.container, style]}>{tabs?.map(renderTab)}</View>;
};

const s = () =>
  themedStyles(({ colors }) => ({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      backgroundColor: colors.primary,
    },
    tabContainer: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 15,
    },
    tabTextStyle: {
      color: colors.text,
    },
    selectedTabTextStyle: {
      color: colors.tint,
    },
  }));
