/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import {v4 as uuidv4} from 'uuid';
import {defaultProfileDto} from "../profile/ProfileEntity.test.data";

export const defaultUserDto = data => {
  const defaultData = {
    "id": data?.id || uuidv4(),
    "role_id": data?.role_id || uuidv4(),
    "username": data?.username || "admin@passbolt.com",
    "active": typeof data?.active === "boolean" ? data.active : true,
    "deleted": typeof data?.deleted === "boolean" ? data.deleted : false,
    "created": data?.created || "2020-04-20T11:32:16+00:00",
    "modified": data?.modified || "2020-04-20T11:32:16+00:00",
    "last_logged_in": data?.last_logged_in || "2012-07-04T13:39:25+00:00",
    "is_mfa_enabled": typeof data?.is_mfa_enabled === "boolean" ? data.deleted : false,
    "profile": defaultProfileDto(Object.assign({user_id: data?.id}, JSON.parse(JSON.stringify(data?.profile || {})))),
  };

  return Object.assign(defaultData, data || {});
};