import {
	createContext,
	useContext,
	ReactNode,
	useState,
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
} from 'react';
import { useGlobalContext } from './store';
import {
	deleteUserAvatar,
	getUserAvatar,
	getWhoAmI,
} from '../utils/cinesync-api/fetch-user';

type UserContextType = {
	user:
		| User
		| {
				statusCode?: number | undefined;
				message?: string | undefined;
		  }
		| any;
	avatar: string;
	setAvatar: Dispatch<SetStateAction<string>>;
	getAvatar: () => Promise<void>;
	deleteAvatarUser: () => Promise<void>;
	refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const { token } = useGlobalContext();
	const [user, setUser] = useState<User | null>(null);
	const [avatar, setAvatar] = useState<string>('');

	const getAvatar = useCallback(async () => {
		const { success, fetchResponseJson } = await getUserAvatar({
			token: token,
		});
		if (success && 'imageUrl' in fetchResponseJson) {
			setAvatar(fetchResponseJson.imageUrl);
		} else {
			setAvatar('');
		}
	}, [token]);

	const deleteAvatarUser = useCallback(async () => {
		const { success, fetchResponseJson } = await deleteUserAvatar({
			token: token,
		});
		if (success) {
			setAvatar('');
		}
	}, [token]);

	const refreshUser = useCallback(async () => {
		const { success, fetchResponseJson } = await getWhoAmI({ token: token });
		if (success && 'id' in fetchResponseJson) {
			setUser(fetchResponseJson);
		}
	}, [token]);

	useEffect(() => {
		refreshUser();
		getAvatar();
	}, [getAvatar, refreshUser]);

	return (
		<>
			{user != null && (
				<UserContext.Provider
					value={{
						user,
						avatar,
						refreshUser,
						setAvatar,
						getAvatar,
						deleteAvatarUser,
					}}
				>
					{children}
				</UserContext.Provider>
			)}
		</>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};
