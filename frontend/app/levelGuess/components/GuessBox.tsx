import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
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
	return (
		<>
			<Input
				type="text"
				value={formValue}
				onChange={(e) => setFormValue(e.target.value)}
				disabled={loading || disabled}
				bg="#00000050"
				color="white"
				fontWeight="bold"
				onKeyDown={async (e) => {
					if (e.key == "Enter") {
						await onGuess(formValue);
						setFormValue("");
					}
				}}
			/>
			<Button
				disabled={formValue.length <= 1}
				onClick={() => {
					onGuess(formValue);
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
