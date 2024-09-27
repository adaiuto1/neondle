import { useContext, useState } from "react";
import { UserContext } from "../Neondle";
import { login, register } from "../utils/userClient";
import {
	Box,
	Button,
	Collapse,
	Fade,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input,
	Link,
	useToast,
	VStack,
} from "@chakra-ui/react";

export default function LoginPage({ afterLogin }: { afterLogin?: () => void }) {
	const toast = useToast();
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [action, setAction] = useState<"login" | "register">("login");
	const [awaitingResponse, setAwaitingResponse] = useState(false);
	const [formValues, setFormValues] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const setFormValue = (delta: object) => {
		setFormValues({ ...formValues, ...delta });
	};
	const [formErrors, setFormErrors] = useState({
		username: "",
		password: "",
		confirmPassword: "",
	});
	const setFormError = (delta: object) => {
		setFormErrors({ ...formErrors, ...delta });
	};
	const onLogin = async () => {
		setAwaitingResponse(true);
		await login({
			username: formValues.username,
			password: formValues.password,
			setCurrentUser: setCurrentUser,
			onError: ({ error }) => {
				if (error?.status === 400) {
					setAction("register");
				}
				setFormError({
					password: error?.message,
				});
			},
		});
		if (!!afterLogin && !!currentUser.username) {
			afterLogin();
		}
		setAwaitingResponse(false);
	};
	const onRegister = async () => {
		setAwaitingResponse(true);
		if (formValues.password !== formValues.confirmPassword) {
			toast({
				position: "top",
				colorScheme: "orange",
				title: "Passwords must match",
			});
		} else {
			await register({
				username: formValues.username,
				password: formValues.password,
				onSuccess: () => onLogin(),
				onError: (error_message?: string) => {
					toast({
						position: "top",
						colorScheme: "orange",
						title: error_message || "Error",
					});
				},
			});
		}
		setAwaitingResponse(false);
	};
	return (
		<>
			<VStack
				width="100%"
				gap={3}
				alignItems="end"
			>
				<FormControl isInvalid={!!formErrors.password}>
					<FormLabel>Username</FormLabel>
					<Input
						type="text"
						value={formValues.username}
						onChange={(e) => {
							setFormValue({ username: e.target.value });
						}}
					></Input>
				</FormControl>
				<FormControl isInvalid={!!formErrors.password}>
					<Flex align="end">
						<FormLabel>Password</FormLabel>
						<Fade in={action === "register"}>
							<FormLabel
								ml="-1"
								fontSize="xs"
								color="#555555"
							>
								{`(6 chars minimum)`}
							</FormLabel>
						</Fade>
					</Flex>
					<Input
						type="password"
						value={formValues.password}
						onChange={(e) => {
							setFormValue({ password: e.target.value });
						}}
					></Input>
					<FormErrorMessage>{formErrors.password}</FormErrorMessage>
				</FormControl>
				<FormControl isInvalid={!!formErrors.confirmPassword}>
					<Collapse in={action === "register"}>
						<Box width="100%">
							<FormLabel>Confirm Password</FormLabel>
							<Input
								type="password"
								value={
									action === "register"
										? formValues.confirmPassword
										: formValues.password
								}
								onChange={(e) => {
									setFormValue({ confirmPassword: e.target.value });
								}}
							></Input>
						</Box>
					</Collapse>
				</FormControl>
				<Flex
					align="center"
					gap={4}
				>
					<Link
						onClick={() => setAction(action === "login" ? "register" : "login")}
					>
						{action === "login" ? "Register" : "Log In"}
					</Link>
					<Button
						colorScheme="blue"
						onClick={() => {
							if (action === "login") onLogin();
							else onRegister();
						}}
						isLoading={awaitingResponse}
						isDisabled={
							formValues.username.length < 4 ||
							formValues.password.length < 6 ||
							(action === "register" && formValues.confirmPassword.length < 6)
						}
					>
						{action === "register" ? "Register" : "Log In"}
					</Button>
				</Flex>
			</VStack>
		</>
	);
}
