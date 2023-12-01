const ReplicatedFirst = game.GetService("ReplicatedFirst");
const ContentProvider = game.GetService("ContentProvider");
const PlayerGui = game.GetService("Players").LocalPlayer.WaitForChild("PlayerGui");

const preLoadingClient = () => {
	const loadingScreen = new Instance("ScreenGui");
	loadingScreen.Name = "LoadingScreen";
	loadingScreen.IgnoreGuiInset = true;
	loadingScreen.ZIndexBehavior = Enum.ZIndexBehavior.Global;
	loadingScreen.DisplayOrder = 100;
	loadingScreen.Parent = PlayerGui;

	const Frame = new Instance("Frame");
	Frame.Parent = loadingScreen;
	Frame.Active = true;
	Frame.BackgroundColor3 = Color3.fromRGB(11, 8, 26);
	Frame.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Frame.BorderSizePixel = 0;
	Frame.Size = new UDim2(1, 0, 1, 0);

	const Frame_2 = new Instance("Frame");
	Frame_2.Parent = Frame;
	Frame_2.AnchorPoint = new Vector2(0.5, 0.5);
	Frame_2.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Frame_2.BackgroundTransparency = 1.0;
	Frame_2.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Frame_2.BorderSizePixel = 0;
	Frame_2.Position = new UDim2(0.5, 0, 0.5, 0);
	Frame_2.Size = new UDim2(0, 890, 0, 234);

	const Letter6 = new Instance("ImageLabel");
	Letter6.Name = "Letter6";
	Letter6.Parent = Frame_2;
	Letter6.AnchorPoint = new Vector2(0.5, 0.5);
	Letter6.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter6.BackgroundTransparency = 1.0;
	Letter6.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter6.BorderSizePixel = 0;
	Letter6.Position = new UDim2(0.451685399, 0, 0.132478639, 0);
	Letter6.Size = new UDim2(0.0235955063, 0, 0.260683775, 0);
	Letter6.Image = "rbxassetid://14749368458";

	const Letter7 = new Instance("ImageLabel");
	Letter7.Name = "Letter7";
	Letter7.Parent = Frame_2;
	Letter7.AnchorPoint = new Vector2(0.5, 0.5);
	Letter7.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter7.BackgroundTransparency = 1.0;
	Letter7.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter7.BorderSizePixel = 0;
	Letter7.Position = new UDim2(0.522471905, 0, 0.132478639, 0);
	Letter7.Size = new UDim2(0.0842696652, 0, 0.260683775, 0);
	Letter7.Image = "rbxassetid://14749368817";

	const Letter2 = new Instance("ImageLabel");
	Letter2.Name = "Letter2";
	Letter2.Parent = Frame_2;
	Letter2.AnchorPoint = new Vector2(0.5, 0.5);
	Letter2.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter2.BackgroundTransparency = 1.0;
	Letter2.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter2.BorderSizePixel = 0;
	Letter2.Position = new UDim2(0.133707866, 0, 0.226495728, 0);
	Letter2.Size = new UDim2(0.0932584256, 0, 0.303418815, 0);
	Letter2.Image = "rbxassetid://14749366255";

	const Letter3 = new Instance("ImageLabel");
	Letter3.Name = "Letter3";
	Letter3.Parent = Frame_2;
	Letter3.AnchorPoint = new Vector2(0.5, 0.5);
	Letter3.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter3.BackgroundTransparency = 1.0;
	Letter3.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter3.BorderSizePixel = 0;
	Letter3.Position = new UDim2(0.197752804, 0, 0.1965812, 0);
	Letter3.Size = new UDim2(0.0303370785, 0, 0.269230783, 0);
	Letter3.Image = "rbxassetid://14749366726";

	const Letter4 = new Instance("ImageLabel");
	Letter4.Name = "Letter4";
	Letter4.Parent = Frame_2;
	Letter4.AnchorPoint = new Vector2(0.5, 0.5);
	Letter4.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter4.BackgroundTransparency = 1.0;
	Letter4.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter4.BorderSizePixel = 0;
	Letter4.Position = new UDim2(0.271910101, 0, 0.170940176, 0);
	Letter4.Size = new UDim2(0.10786517, 0, 0.290598303, 0);
	Letter4.Image = "rbxassetid://14749367247";

	const Letter5 = new Instance("ImageLabel");
	Letter5.Name = "Letter5";
	Letter5.Parent = Frame_2;
	Letter5.AnchorPoint = new Vector2(0.5, 0.5);
	Letter5.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter5.BackgroundTransparency = 1.0;
	Letter5.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter5.BorderSizePixel = 0;
	Letter5.Position = new UDim2(0.370786518, 0, 0.145299152, 0);
	Letter5.Size = new UDim2(0.078651689, 0, 0.273504287, 0);
	Letter5.Image = "rbxassetid://14749367794";

	const Letter8 = new Instance("ImageLabel");
	Letter8.Name = "Letter8";
	Letter8.Parent = Frame_2;
	Letter8.AnchorPoint = new Vector2(0.5, 0.5);
	Letter8.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter8.BackgroundTransparency = 1.0;
	Letter8.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter8.BorderSizePixel = 0;
	Letter8.Position = new UDim2(0.612359524, 0, 0.141025648, 0);
	Letter8.Size = new UDim2(0.076404497, 0, 0.264957279, 0);
	Letter8.Image = "rbxassetid://14749369300";

	const Letter9 = new Instance("ImageLabel");
	Letter9.Name = "Letter9";
	Letter9.Parent = Frame_2;
	Letter9.AnchorPoint = new Vector2(0.5, 0.5);
	Letter9.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter9.BackgroundTransparency = 1.0;
	Letter9.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter9.BorderSizePixel = 0;
	Letter9.Position = new UDim2(0.667415738, 0, 0.15384616, 0);
	Letter9.Size = new UDim2(0.0269662924, 0, 0.264957279, 0);
	Letter9.Image = "rbxassetid://14749369857";

	const Letter10 = new Instance("ImageLabel");
	Letter10.Name = "Letter10";
	Letter10.Parent = Frame_2;
	Letter10.AnchorPoint = new Vector2(0.5, 0.5);
	Letter10.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter10.BackgroundTransparency = 1.0;
	Letter10.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter10.BorderSizePixel = 0;
	Letter10.Position = new UDim2(0.734831452, 0, 0.17521368, 0);
	Letter10.Size = new UDim2(0.0898876414, 0, 0.290598303, 0);
	Letter10.Image = "rbxassetid://14749370397";

	const Letter11 = new Instance("ImageLabel");
	Letter11.Name = "Letter11";
	Letter11.Parent = Frame_2;
	Letter11.AnchorPoint = new Vector2(0.5, 0.5);
	Letter11.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter11.BackgroundTransparency = 1.0;
	Letter11.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter11.BorderSizePixel = 0;
	Letter11.Position = new UDim2(0.795505643, 0, 0.200854704, 0);
	Letter11.Size = new UDim2(0.0303370785, 0, 0.264957279, 0);
	Letter11.Image = "rbxassetid://14749370983";

	const Letter12 = new Instance("ImageLabel");
	Letter12.Name = "Letter12";
	Letter12.Parent = Frame_2;
	Letter12.AnchorPoint = new Vector2(0.5, 0.5);
	Letter12.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter12.BackgroundTransparency = 1.0;
	Letter12.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter12.BorderSizePixel = 0;
	Letter12.Position = new UDim2(0.86179775, 0, 0.222222224, 0);
	Letter12.Size = new UDim2(0.0842696652, 0, 0.286324799, 0);
	Letter12.Image = "rbxassetid://14749371521";

	const Letter13 = new Instance("ImageLabel");
	Letter13.Name = "Letter13";
	Letter13.Parent = Frame_2;
	Letter13.AnchorPoint = new Vector2(0.5, 0.5);
	Letter13.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter13.BackgroundTransparency = 1.0;
	Letter13.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter13.BorderSizePixel = 0;
	Letter13.Position = new UDim2(0.953932583, 0, 0.277777791, 0);
	Letter13.Size = new UDim2(0.0898876414, 0, 0.299145311, 0);
	Letter13.Image = "rbxassetid://14749372206";

	const Letter1 = new Instance("ImageLabel");
	Letter1.Name = "Letter1";
	Letter1.Parent = Frame_2;
	Letter1.AnchorPoint = new Vector2(0.5, 0.5);
	Letter1.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	Letter1.BackgroundTransparency = 1.0;
	Letter1.BorderColor3 = Color3.fromRGB(0, 0, 0);
	Letter1.BorderSizePixel = 0;
	Letter1.Position = new UDim2(0.0471910127, 0, 0.303418815, 0);
	Letter1.Size = new UDim2(0.0955056176, 0, 0.303418815, 0);
	Letter1.Image = "rbxassetid://14749365674";

	const UIAspectRatioConstraint = new Instance("UIAspectRatioConstraint");
	UIAspectRatioConstraint.Parent = Frame_2;
	UIAspectRatioConstraint.AspectRatio = 3.803;

	const LetterX = new Instance("ImageLabel");
	LetterX.Name = "LetterX";
	LetterX.Parent = Frame_2;
	LetterX.AnchorPoint = new Vector2(0.5, 0.5);
	LetterX.BackgroundColor3 = Color3.fromRGB(255, 255, 255);
	LetterX.BackgroundTransparency = 1.0;
	LetterX.BorderColor3 = Color3.fromRGB(0, 0, 0);
	LetterX.BorderSizePixel = 0;
	LetterX.Position = new UDim2(0.480898887, 0, 0.692307711, 0);
	LetterX.Size = new UDim2(0.208988771, 0, 0.615384638, 0);
	LetterX.Image = "rbxassetid://14749393023";

	const TextLabel = new Instance("TextLabel");
	TextLabel.Parent = Frame;
	TextLabel.AnchorPoint = new Vector2(0.5, 0.5);
	TextLabel.BackgroundTransparency = 1.0;
	TextLabel.BorderSizePixel = 0;
	TextLabel.Position = new UDim2(0.5, 0, 0.8, 0);
	TextLabel.AutomaticSize = Enum.AutomaticSize.XY;
	TextLabel.TextSize = 48;
	TextLabel.TextColor3 = Color3.fromRGB(255, 255, 255);
	TextLabel.Font = Enum.Font.SourceSansBold;
	TextLabel.Text = "Waiting for client to load...";

	const UIScale = new Instance("UIScale");
	UIScale.Parent = Frame_2;

	return loadingScreen;
};

ReplicatedFirst.RemoveDefaultLoadingScreen();

preLoadingClient();
ContentProvider.PreloadAsync([game.GetService("ReplicatedStorage")]); // Preload all replicated storage assets
