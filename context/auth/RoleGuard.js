import React, {useContext} from 'react';
import {AuthContext} from './AuthContext';

const RoleGuard = ({allowedRoles, children}) => {
  const {user} = useContext(AuthContext);

  const isAuthorized = user && allowedRoles.some(role => user[role]);

  return isAuthorized ? children : null;
};

export default RoleGuard;
