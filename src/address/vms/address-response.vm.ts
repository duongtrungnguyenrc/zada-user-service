import { withBaseResponse } from "@duongtrungnguyen/micro-commerce";

import { AddressVM } from "./address.vm";

export class AddressResponseVM extends withBaseResponse(AddressVM) {}
