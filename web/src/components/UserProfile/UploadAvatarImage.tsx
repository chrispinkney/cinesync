'use client';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import { useGlobalContext } from '@/context/store';
import { useUser } from '@/context/user.context';

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

const UploadAvatarImage = () => {
	const { token } = useGlobalContext();
	const userContext = useUser();

	const handleUploadAvatar = async () => {
		const headers = { Authorization: `${token}` };
		const formData = new FormData();
		let avatar;
		let avatarFile;
		if (document.getElementById('avatarInput')) {
			avatar = document?.getElementById('avatarInput') as HTMLInputElement;
			avatarFile = avatar.files?.[0];
		}

		if (avatarFile) {
			formData.append('image', avatarFile);
		}

		try {
			await fetch(
				`${process.env.NEXT_PUBLIC_URL}/auth/avatar/upload` ||
					'http://localhost:3000/auth/avatar/upload',
				{
					method: 'POST',
					headers: { ...headers },
					body: formData,
				},
			);
			userContext.getAvatar();
		} catch (error: any) {
			console.log(error);
		}
	};

	return (
		<>
			<Button
				component="label"
				variant="contained"
				startIcon={<CloudUploadIcon />}
			>
				Upload New Avatar
				<VisuallyHiddenInput
					type="file"
					accept="image/jpeg, image/png, image/gif"
					id="avatarInput"
					onChange={handleUploadAvatar}
				/>
			</Button>
		</>
	);
};

export default UploadAvatarImage;
