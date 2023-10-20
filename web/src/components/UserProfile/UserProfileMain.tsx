'use client';
import { useUser } from '@/context/user.context';
import ProfileTop from './ProfileTop';
import ProfileBottom from './ProfileBottom';
import Divider from '@mui/material/Divider';

const UserProfileMain = () => {
	const context = useUser();
	return (
		<>
			<ProfileTop />
			<Divider />
			<ProfileBottom refreshContext={context.refreshUser} />
		</>
	);
};

export default UserProfileMain;
