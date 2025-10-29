import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddFareCardProps {
	fareInput: string;
	platform: string;
	onFareInputChange: (value: string) => void;
	onPlatformChange: (value: string) => void;
	onAddFare: () => void;
	disabled: boolean;
}

export function AddFareCard({
	fareInput,
	platform,
	onFareInputChange,
	onPlatformChange,
	onAddFare,
	disabled,
}: AddFareCardProps) {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !disabled) {
			onAddFare();
		}
	};

	const handleAddFare = () => {
		if (!fareInput) return;

		const raw = parseFloat(fareInput);
		const adjusted =
			platform === "Bolt" ? parseFloat((raw * 0.77).toFixed(2)) : raw;

		const newFare = { platform, amount: adjusted };
		const updatedFares = [...fares, newFare];

		setFares(updatedFares);
		localStorage.setItem("fares", JSON.stringify(updatedFares));

		setfareInput("");
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Fare</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-3">
					<div className="flex gap-2">
						<Input
							value={fareInput}
							onChange={(e) => onFareInputChange(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Fare amount"
							type="number"
							min="0"
							step="0.01"
							className="w-[60%]"
							disabled={disabled}
						/>
						<select
							value={platform}
							onChange={(e) => onPlatformChange(e.target.value)}
							className="border rounded-md px-2 py-1 w-[40%] bg-white text-gray-700"
							disabled={disabled}
						>
							<option value="Uber">Uber</option>
							<option value="Bolt">Bolt</option>
							<option value="Hailing">Hailing</option>
						</select>
					</div>

					<Button
						onClick={onAddFare}
						disabled={disabled}
						className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
