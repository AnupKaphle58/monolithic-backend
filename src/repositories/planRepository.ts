import { InputPlanInterface, PlanInterface } from "@src/interfaces";
import { BaseRepository } from "./baseRepository";
import Model from "@src/models";



export class PlanRepository extends BaseRepository<
  InputPlanInterface,
  PlanInterface
> {
	constructor() {
		super(Model.PlanModel);
	}
}