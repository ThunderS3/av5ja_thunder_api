-- CreateTable
CREATE TABLE "schedules" (
    "id" CHAR(32) NOT NULL,
    "start_time" DATE,
    "end_time" DATE,
    "stage_id" SMALLINT,
    "boss_id" SMALLINT,
    "weapon_list" SMALLINT[],
    "mode" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "rare_weapons" SMALLINT[],
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "results" (
    "id" CHAR(32) NOT NULL,
    "uuid" UUID NOT NULL,
    "play_time" DATE NOT NULL,
    "boss_counts" SMALLINT[],
    "boss_kill_counts" SMALLINT[],
    "ikura_num" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT NOT NULL,
    "golden_ikura_assist_num" SMALLINT NOT NULL,
    "night_less" BOOLEAN NOT NULL,
    "danger_rate" DECIMAL(4,3) NOT NULL,
    "members" CHAR(20)[],
    "bronze" SMALLINT,
    "silver" SMALLINT,
    "gold" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "failure_wave" SMALLINT,
    "is_boss_defeated" BOOLEAN,
    "is_giant_defeated" BOOLEAN,
    "is_rope_defeated" BOOLEAN,
    "is_jaw_defeated" BOOLEAN,
    "scenario_code" TEXT,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "schedule_id" CHAR(32) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waves" (
    "id" CHAR(32) NOT NULL,
    "uuid" UUID NOT NULL,
    "play_time" DATE NOT NULL,
    "wave_id" SMALLINT NOT NULL,
    "water_level" SMALLINT NOT NULL,
    "event_type" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT,
    "golden_ikura_pop_num" SMALLINT NOT NULL,
    "quota_num" SMALLINT,
    "is_clear" BOOLEAN NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "result_id" CHAR(32) NOT NULL,

    CONSTRAINT "waves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" CHAR(32) NOT NULL,
    "uuid" UUID NOT NULL,
    "npln_user_id" CHAR(20) NOT NULL,
    "play_time" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "by_name" TEXT NOT NULL,
    "name_id" TEXT NOT NULL,
    "badges" INTEGER[],
    "nameplate" SMALLINT NOT NULL,
    "text_color" INTEGER[],
    "uniform" SMALLINT NOT NULL,
    "boss_kill_counts_total" SMALLINT NOT NULL,
    "boss_kill_counts" SMALLINT[],
    "dead_count" SMALLINT NOT NULL,
    "help_count" SMALLINT NOT NULL,
    "ikura_num" SMALLINT NOT NULL,
    "golden_ikura_num" SMALLINT NOT NULL,
    "golden_ikura_assist_num" SMALLINT NOT NULL,
    "job_bonus_rate" SMALLINT,
    "job_rate" SMALLINT NOT NULL,
    "job_score" SMALLINT,
    "kuma_point" SMALLINT,
    "grade_id" SMALLINT,
    "grade_point" SMALLINT,
    "smell_meter" SMALLINT,
    "species" TEXT NOT NULL,
    "special_id" SMALLINT,
    "special_count" SMALLINT[],
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,
    "result_id" CHAR(32) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "schedules_stage_id_idx" ON "schedules"("stage_id");

-- CreateIndex
CREATE INDEX "schedules_boss_id_idx" ON "schedules"("boss_id");

-- CreateIndex
CREATE INDEX "schedules_mode_idx" ON "schedules"("mode");

-- CreateIndex
CREATE INDEX "schedules_rule_idx" ON "schedules"("rule");

-- CreateIndex
CREATE INDEX "results_is_clear_idx" ON "results"("is_clear");

-- CreateIndex
CREATE INDEX "waves_water_level_event_type_idx" ON "waves"("water_level", "event_type");

-- CreateIndex
CREATE INDEX "waves_is_clear_idx" ON "waves"("is_clear");

-- CreateIndex
CREATE INDEX "players_npln_user_id_idx" ON "players"("npln_user_id");

-- CreateIndex
CREATE INDEX "players_name_idx" ON "players"("name");

-- CreateIndex
CREATE INDEX "players_ikura_num_idx" ON "players"("ikura_num");

-- CreateIndex
CREATE INDEX "players_golden_ikura_num_idx" ON "players"("golden_ikura_num");

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waves" ADD CONSTRAINT "waves_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
