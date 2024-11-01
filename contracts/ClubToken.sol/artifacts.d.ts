// This file was autogenerated by hardhat-viem, do not edit it.
// prettier-ignore
// tslint:disable
// eslint-disable

import "hardhat/types/artifacts";
import type { GetContractReturnType } from "@nomicfoundation/hardhat-viem/types";

import { ClubToken$Type } from "./ClubToken";

declare module "hardhat/types/artifacts" {
  interface ArtifactsMap {
    ["ClubToken"]: ClubToken$Type;
    ["contracts/ClubToken.sol:ClubToken"]: ClubToken$Type;
  }

  interface ContractTypesMap {
    ["ClubToken"]: GetContractReturnType<ClubToken$Type["abi"]>;
    ["contracts/ClubToken.sol:ClubToken"]: GetContractReturnType<ClubToken$Type["abi"]>;
  }
}
