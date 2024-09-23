import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

export default function GameCompletedModal({
	game_finished,
	sillyMode,
}: {
	game_finished: boolean;
	sillyMode: boolean;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	useEffect(() => {
		if (game_finished) {
			onOpen();
		}
	}, [game_finished]);
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
		>
			<ModalOverlay></ModalOverlay>
			<ModalContent>
				<ModalHeader>{`${
					sillyMode ? "Silly Mode" : ""
				} Neondle Complete!`}</ModalHeader>
				<ModalCloseButton></ModalCloseButton>
				<ModalBody></ModalBody>
			</ModalContent>
		</Modal>
	);
}
