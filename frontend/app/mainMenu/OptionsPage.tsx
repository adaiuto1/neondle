import {
	Box,
	Button,
	Collapse,
	Fade,
	Flex,
	FormControl,
	FormLabel,
	GenericAvatarIcon,
	HStack,
	IconButton,
	Input,
	InputGroup,
	InputRightElement,
	Link,
	Spacer,
	Text,
	useToast,
	VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useMemo, useState } from "react";
import {
	changePassword,
	deleteMyAccount,
	getUserCredentials,
	logout,
} from "../utils/userClient";
import { UserContext } from "../Neondle";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function OptionsPage({ onClose }: { onClose?: () => void }) {
	const toast = useToast();
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const [user, setUser] = useState({ username: "", password: "" });
	const [show, setShow] = useState(false);
	const [changing, setChanging] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [awaitingReset, setAwaitingReset] = useState(false);
	const [formValues, setFormValues] = useState({
		password: "",
		confirmPassword: "",
	});
	const setFormValue = (delta: object) => {
		setFormValues({ ...formValues, ...delta });
	};
	useMemo(() => {
		if (changing) setFormValues({ password: "", confirmPassword: "" });
		else {
			setFormValue({ password: user.password });
		}
	}, [changing]);
	const loadCredentials = async () => {
		if (currentUser.token) {
			const { response, error } = await getUserCredentials(currentUser.token);
			console.log(response);
			if (response) {
				setUser({
					username: response.username,
					password: response.password || "",
				});
				setFormValue({
					password: response.password,
				});
			} else if (error) {
				toast({
					position: "top",
					colorScheme: "red",
					title: "Invalid Token",
					description: "Please log in again.",
				});
			}
		}
	};
	useEffect(() => {
		loadCredentials();
	}, []);
	const onChangePassword = async () => {
		setAwaitingReset(true);
		if (currentUser.token) {
			const { response, error } = await changePassword(
				currentUser.token,
				formValues.password
			);
			setUser({ ...user, ...{ password: response?.password || "" } });
			if (response) {
				toast({
					position: "top",
					colorScheme: "blue",
					description: "Password successfully changed",
				});
			} else if (error) {
				toast({
					position: "top",
					colorScheme: "red",
					description: "Unable to change password. Try again later.",
				});
			}
		}
		setChanging(false);
		setAwaitingReset(false);
	};
	const onDelete = async () => {
		setAwaitingReset(true);
		if (currentUser.token) {
			const { response, error } = await deleteMyAccount(currentUser.token);
			console.log(response);
			if (response?.success) {
				toast({
					position: "top",
					colorScheme: "blue",
					description: "Account successfully deleted.",
				});
				logout({ setCurrentUser: setCurrentUser });
				if (!!onClose) {
					onClose();
				}
			} else if (error) {
				toast({
					position: "top",
					colorScheme: "blue",
					description: "Unable to delete account. Try again later",
				});
			}
		}
		setAwaitingReset(false);
	};
	return (
		<>
			<VStack width="100%">
				<Box
					width="100%"
					as={Link}
				>
					<Flex gap={1}>
						<GenericAvatarIcon
							boxSize="1.5em"
							color="black"
						></GenericAvatarIcon>{" "}
						<Text>{currentUser.username}</Text>
					</Flex>
				</Box>
				<FormControl>
					<FormLabel>{`${changing ? "New" : ""} Password`}</FormLabel>
					<HStack width="100%">
						<InputGroup>
							<Input
								isDisabled={!changing}
								type={show ? "text" : "password"}
								value={formValues.password}
								onChange={(e) => setFormValue({ password: e.target.value })}
							></Input>
							<InputRightElement>
								<IconButton
									onClick={() => setShow(!show)}
									size="sm"
									h="1.75em"
									mr="2em"
									bg="transparent"
									aria-label="show/hide password"
									icon={
										show ? (
											<ViewOffIcon boxSize="1.5em" />
										) : (
											<ViewIcon boxSize="1.5em" />
										)
									}
								></IconButton>
							</InputRightElement>
						</InputGroup>
						<Button
							maxHeight="100%"
							size="md"
							onClick={() => setChanging(!changing)}
							colorScheme={changing ? "red" : "gray"}
							isLoading={!user.password && !deleting}
							isDisabled={deleting}
						>
							{changing ? "Cancel" : "Change"}
						</Button>
					</HStack>
				</FormControl>
				<Box width="100%">
					<Collapse in={changing}>
						<FormControl>
							<FormLabel>Confirm New Password</FormLabel>
							<Input
								type="password"
								value={formValues.confirmPassword}
								onChange={(e) =>
									setFormValue({ confirmPassword: e.target.value })
								}
							></Input>
						</FormControl>
					</Collapse>
				</Box>
				{(changing && (
					<>
						<Box width="100%">
							<Fade in={changing}>
								<HStack width="100%">
									<Spacer></Spacer>
									<Button
										colorScheme="blue"
										size="sm"
										isDisabled={
											formValues.password.length < 6 ||
											formValues.confirmPassword !== formValues.password
										}
										isLoading={awaitingReset}
										onClick={() => onChangePassword()}
									>
										Change Password
									</Button>
								</HStack>
							</Fade>
						</Box>
					</>
				)) || (
					<Box width="100%">
						<Fade in={!changing}>
							<HStack width="100%">
								<Button
									colorScheme={deleting ? "gray" : "red"}
									size="md"
									onClick={() => setDeleting(!deleting)}
								>
									{deleting ? "Cancel" : `Delete Account`}
								</Button>
								<Spacer></Spacer>
								<Button
									colorScheme="blue"
									size="md"
									isDisabled={deleting}
									onClick={() => logout({ setCurrentUser: setCurrentUser })}
								>
									Log Out
								</Button>
							</HStack>
						</Fade>
						<Collapse in={deleting}>
							<HStack
								width="100%"
								mt="1em"
							>
								<Text>This action cannot be undone.</Text>
								<Spacer></Spacer>
								<Button
									colorScheme="red"
									size="md"
									onClick={() => onDelete()}
									isLoading={awaitingReset}
								>
									Delete My Account
								</Button>
							</HStack>
						</Collapse>
					</Box>
				)}
			</VStack>
		</>
	);
}
