import { withBaseResponse, withPagingData } from "@duongtrungnguyen/micro-commerce";

import { ActivityVM } from "./activity.vm";

export class PagingActivitiesResponseVM extends withBaseResponse(withPagingData(ActivityVM)) {}
