import { useState } from 'react';

export default function useRole() {
  const getRole = () => {
    const role = localStorage.getItem('role');

    return role
  };

  const [role, setRole] = useState(getRole());

  const saveRole = userRole => {
    localStorage.setItem('role', userRole)
    setRole(userRole);
  };

  return {
    setRole: saveRole,
    role
  }
}