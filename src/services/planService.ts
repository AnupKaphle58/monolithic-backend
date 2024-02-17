import * as Boom from '@hapi/boom';
import { BillingIntervalEnum } from '@src/enums';
import { InputPlanInterface, PlanInterface } from "@src/interfaces";
import { PlanRepository } from "@src/repositories";
import { WhereOptions } from 'sequelize';



export class PlanService {
  private repository: PlanRepository;

  constructor() {
    this.repository = new PlanRepository();
  }

  async create(input: InputPlanInterface): Promise<PlanInterface> {
    const planExists = await this.repository.findOne({
      where: { slug: input.slug },
    });
    if (planExists) {
      throw Boom.badRequest(`Plan exists`, [
        {
          name: "PlanExistsException",
          path: ["createPlan"],
        },
      ]);
    }
    return this.repository.create(input);
  }

  async findByPk(id: number): Promise<PlanInterface> {
    const planExists = await this.repository.findByPk(id);
    if (!planExists) {
      throw Boom.badRequest(`Plan doesnot exists`, [
        {
          name: "PlanNotExistsException",
          path: ["findPlan"],
        },
      ]);
    }
    return planExists;
  }

  async findOne({
    planSlug,
    occurance
  }: {
    planSlug?: string;
    occurance?: BillingIntervalEnum
  }): Promise<PlanInterface> {
    let where: WhereOptions<any> = {};
    if (planSlug) {
      where = { ...where, slug: planSlug };
    }

    if(occurance) {
      where = { ...where, occurance: occurance}
    }
    return this.repository.findOne({ where });
  }
}