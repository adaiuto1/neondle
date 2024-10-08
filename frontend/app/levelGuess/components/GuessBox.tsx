import { Button, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
interface GuessBoxPropType {
	width?: string;
	onGuess: (input: string) => void;
	loading: boolean;
	disabled: boolean;
}
export default function GuessBox({
	onGuess,
	loading,
	disabled,
}: GuessBoxPropType) {
	const [formValue, setFormValue] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [loading, disabled]);
	return (
		<>
			<Input
				ref={inputRef}
				type="text"
				value={formValue}
				onChange={(e) => setFormValue(e.target.value)}
				isDisabled={loading || disabled}
				placeholder={loading ? "Loading Today's Clue" : ""}
				bg="#00000050"
				color="white"
				fontWeight="bold"
				onKeyDown={async (e) => {
					if (e.key == "Enter") {
						onGuess(formValue);
						setFormValue("");
					}
				}}
			/>
			<Button
				disabled={formValue.length <= 1}
				onClick={() => {
					onGuess(formValue.toLowerCase());
					setFormValue("");
				}}
				isLoading={loading}
				isDisabled={disabled}
				colorScheme="blue"
			>
				Guess
			</Button>
		</>
	);
}
