import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { GoalService } from './goal.service';

@Controller('goals')
export class GoalController {
  constructor(private goalService: GoalService) {}

  @Post()
  async create(
    @Body()
    body: {
      userId: number;
      name: string;
      targetAmount: number;
      timeFrame: number;
    }
  ) {
    return this.goalService.createGoal(
      body.userId,
      body.name,
      body.targetAmount,
      body.timeFrame
    );
  }

  @Get(':userId')
  async findByUser(@Param('userId') userId: number) {
    return this.goalService.findGoalsByUser(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.goalService.deleteGoal(id);
  }
}
