import { useState } from 'react';
import { RoleSelectionScreen, UserRole } from '../../../presentation/screens/auth/RoleSelectionScreen';

export default function RoleSelectionRoute() {
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    return <RoleSelectionScreen selectedRole={selectedRole} onRoleSelect={setSelectedRole} />;
} 