import { Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { gameType, UserContext } from "../Neondle";
import { getAnonymousNeon } from "../utils/userClient";

interface guestButtonProps {
	to: gameType;
}
export default function PlayAsGuestButton() {
	const { setCurrentUser } = useContext(UserContext);
	const [loading, setLoading] = useState(false);
	const getNeonAccount = async () => {
		setLoading(true);
		const { response, error } = await getAnonymousNeon();
		if (response) {
			setCurrentUser({ username: response.username, token: response.token });
		} else {
			alert(error?.message);
		}
	};
	return (
		<Button
			size="sm"
			onClick={() => getNeonAccount()}
			isLoading={loading}
		>
			Play as Guest
		</Button>
	);
}
