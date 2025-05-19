import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { AddressVM } from "./address.vm";

export class AddressesResponseVM extends withBaseResponse([AddressVM] as any) {}
