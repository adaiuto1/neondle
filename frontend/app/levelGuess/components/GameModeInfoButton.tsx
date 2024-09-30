import { InfoIcon } from "@chakra-ui/icons";
import {
	Button,
	Divider,
	Heading,
	IconButton,
	ListItem,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Tooltip,
	UnorderedList,
	useDisclosure,
} from "@chakra-ui/react";

export default function GameModeInfoButton({
	disableToolTip,
}: {
	disableToolTip: boolean;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	// useEffect(() => {
	// 	if (!has_played_before) {
	// 		onOpen();
	// 	}
	// }, []);
	return (
		<>
			<Tooltip
				defaultIsOpen
				isDisabled={disableToolTip}
				label="Read the Rules!"
				placement="left"
				hasArrow
			>
				<IconButton
					aria-label="info"
					icon={<InfoIcon></InfoIcon>}
					variant="ghost"
					onClick={() => onOpen()}
				></IconButton>
			</Tooltip>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="3xl"
			>
				<ModalOverlay></ModalOverlay>
				<ModalContent>
					<ModalHeader fontSize="3xl">How to Play</ModalHeader>
					<ModalCloseButton></ModalCloseButton>
					<ModalBody>
						<Heading fontSize="2xl">Neondle</Heading>
						<Text>
							A Neon White Wordle clone, Neondle will select a Neon White level
							and provide clues for the player as they make attempts to guess
							it.
						</Text>
						<Divider
							my="0.5em"
							opacity={0}
						></Divider>

						<Text>
							{`Neondle clues provide info on the following characteristics of the
							game's levels:`}
						</Text>
						<UnorderedList>
							<ListItem>Chapter</ListItem>
							<ListItem>Demon Count</ListItem>
							<ListItem>IL World Record Time</ListItem>
							<ListItem>Date of World Record</ListItem>
						</UnorderedList>
						<Divider my="0.75em"></Divider>
						<Heading fontSize="2xl">Game Modes</Heading>
						<Text>{`Neondle can be played in two modes once per day.`}</Text>
						<Divider
							my="0.5em"
							opacity={0}
						></Divider>
						<Heading fontSize="lg">Normal</Heading>
						<UnorderedList>
							<ListItem>
								<strong style={{ color: "red" }}>EXCLUDES</strong> Chapter 11 &
								Sidequest Levels
							</ListItem>
							<ListItem>
								<strong>EXCLUDES</strong> Boss Fights
							</ListItem>
						</UnorderedList>
						<Divider
							my="0.5em"
							opacity={0}
						></Divider>
						<Heading fontSize="lg">Hard Mode</Heading>
						<UnorderedList>
							<ListItem>
								<strong style={{ color: "green" }}>INCLUDES</strong> Chapter 11
								& Sidequest Levels
							</ListItem>
							<ListItem>
								<strong>EXCLUDES</strong> Boss Fights
							</ListItem>
						</UnorderedList>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={() => onClose()}
						>
							{`Let's Play!`}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}
