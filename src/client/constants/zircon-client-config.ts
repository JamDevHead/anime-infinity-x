import { ZirconClientConfigurationBuilder } from "@rbxts/zircon/out/Class/ZirconClientConfigurationBuilder";
import { EnableGizmos } from "@/shared/commands/debug/enable-gizmos";
import { Print } from "@/shared/commands/print";

export const ZirconClientConfig = new ZirconClientConfigurationBuilder().AddFunction(Print).AddFunction(EnableGizmos);
