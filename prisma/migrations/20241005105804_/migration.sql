-- CreateTable
CREATE TABLE "Schedule" (
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

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
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
    "scenario_code" TEXT,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wave" (
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

    CONSTRAINT "Wave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
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

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Schedule_stage_id_idx" ON "Schedule"("stage_id");

-- CreateIndex
CREATE INDEX "Schedule_boss_id_idx" ON "Schedule"("boss_id");

-- CreateIndex
CREATE INDEX "Schedule_mode_idx" ON "Schedule"("mode");

-- CreateIndex
CREATE INDEX "Schedule_rule_idx" ON "Schedule"("rule");

-- CreateIndex
CREATE INDEX "Result_is_clear_idx" ON "Result"("is_clear");

-- CreateIndex
CREATE INDEX "Player_npln_user_id_idx" ON "Player"("npln_user_id");

-- CreateIndex
CREATE INDEX "Player_name_idx" ON "Player"("name");

-- CreateIndex
CREATE INDEX "Player_ikura_num_idx" ON "Player"("ikura_num");

-- CreateIndex
CREATE INDEX "Player_golden_ikura_num_idx" ON "Player"("golden_ikura_num");
