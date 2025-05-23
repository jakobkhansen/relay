/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 * @oncall relay
 */

'use strict';

const compileGraphQLTag = require('./compileGraphQLTag');
const getValidGraphQLTag = require('./getValidGraphQLTag');
const {createMacro} = require('babel-plugin-macros');

const configName = 'relay';

function BabelPluginRelayMacro({references, state, babel, config}: any) {
  const {types: t} = babel;
  Object.keys(references).forEach(referenceKey => {
    references[referenceKey].forEach(reference => {
      const path = reference.parentPath;
      const ast = getValidGraphQLTag(path);
      if (ast) {
        compileGraphQLTag(
          t,
          path,
          // $FlowFixMe[unsafe-object-assign]
          Object.assign(state, config ? {opts: config} : {}),
          ast,
        );
      }
    });
  });
}

module.exports = (createMacro(BabelPluginRelayMacro, {configName}): any);
