/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2016-2020 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* @flow */

import React from 'react';
import { groupBy } from 'lodash';

import BpkSectionList, {
  BpkSectionListHeader,
  BpkSectionListItem,
  BpkSectionListItemSeparator,
} from '../../bpk-component-section-list';

import BpkFlag from './BpkFlag';
import {
  type Code,
  type DialingCodeListProps,
  LIST_COMMON_PROP_TYPES,
  LIST_COMMON_DEFAULT_PROPS,
} from './common-types';

/*
Takes data in the format:
[
  {name: 'Foo'},
  {name: 'Bar'},
  {name: 'Baz'},
]

and returns:
[
  {
    title: 'F',
    data: [{name: 'Foo'}],
  },
  {
    title: 'B',
    data: [{name: 'Bar'}, {name: 'Baz'}],
  },
]
*/
const convertCodesIntoSections = (data, suggested) => {
  const promotedData = suggested
    ? [
        {
          title: suggested.title,
          data: data.filter(code => suggested.ids.includes(code.id)),
        },
      ]
    : [];
  const groupedList = groupBy(data, x => x.name[0].toLowerCase());
  return [
    ...promotedData,
    ...Object.keys(groupedList).map(letter => ({
      title: letter.toUpperCase(),
      data: groupedList[letter],
    })),
  ];
};

export type Props = {
  ...$Exact<DialingCodeListProps>,
};

export const getFilteredDialingCodes = (
  searchText: string,
  dialingCodes: Array<Code>,
): Array<Code> =>
  dialingCodes.filter(
    dialingCode =>
      dialingCode.name.toLowerCase().includes(searchText.toLowerCase()) ||
      dialingCode.dialingCode.toLowerCase().includes(searchText.toLowerCase()),
  );

const BpkDialingCodeList = ({
  dialingCodes,
  onItemPress,
  renderFlag,
  selectedId,
  suggested,
  ...rest
}: Props) => (
  <BpkSectionList
    sections={convertCodesIntoSections(dialingCodes, suggested)}
    renderItem={({ item }) => (
      <BpkSectionListItem
        title={`${item.dialingCode} ${item.name}`}
        selected={selectedId === item.id}
        onPress={() => {
          onItemPress(item);
        }}
        image={<BpkFlag flag={renderFlag(item)} />}
      />
    )}
    renderSectionHeader={({ section }) => (
      <BpkSectionListHeader title={section.title} />
    )}
    keyExtractor={item => item.id}
    ItemSeparatorComponent={BpkSectionListItemSeparator}
    {...rest}
  />
);

BpkDialingCodeList.propTypes = LIST_COMMON_PROP_TYPES;
BpkDialingCodeList.defaultProps = LIST_COMMON_DEFAULT_PROPS;

export default BpkDialingCodeList;
