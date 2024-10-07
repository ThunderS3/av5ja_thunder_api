SELECT
    JSON_BUILD_OBJECT(
		'id', MD5(CONCAT_WS(':', TO_CHAR(s.start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), TO_CHAR(s.end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'))),
        'startTime', CASE
						WHEN s.start_time IS NULL THEN NULL
						ELSE TO_CHAR(s.start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')
					END,
        'endTime', CASE
						WHEN s.end_time IS NULL THEN NULL
						ELSE TO_CHAR(s.end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')
				END,
        'mode', s.mode,
        'rule', s.rule,
        'bossId', s.boss_id,
        'stageId', s.stage_id,
        'weaponList', s.weapon_list,
		'rareWeapons', ARRAY[]::integer[]
    ) AS schedule,
    JSON_AGG(JSON_BUILD_OBJECT(
		'id', MD5(CONCAT_WS(':', TO_CHAR(r.play_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), 'a7grz65rxkvhfsbwmxmm')),
        'uuid', r.uuid,
        'schedule', JSON_BUILD_OBJECT(
			'id', MD5(CONCAT_WS(':', TO_CHAR(s.start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), TO_CHAR(s.end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'))),
            'startTime', CASE
							WHEN s.start_time IS NULL THEN NULL
							ELSE TO_CHAR(s.start_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')
							END,
            'endTime', CASE
							WHEN s.end_time IS NULL THEN NULL
							ELSE TO_CHAR(s.end_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')
							END,
            'mode', s.mode,
            'rule', s.rule,
            'bossId', s.boss_id,
            'stageId', s.stage_id,
            'weaponList', s.weapon_list,
			'rareWeapons', ARRAY[]::integer[]
        ),
        'scale', ARRAY[r.bronze, r.silver, r.gold],
        'jobResult', JSON_BUILD_OBJECT(
            'failureWave', r.failure_wave,
            'isClear', r.is_clear,
            'bossId', r.boss_id,
            'isBossDefeated', r.is_boss_defeated
        ),
		'bossId', NULL,
        'bossResults', NULL,
        'playTime', TO_CHAR(r.play_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'),
        'bossCounts', r.boss_counts,
        'bossKillCounts', r.boss_kill_counts,
        'dangerRate', r.danger_rate,
        'ikuraNum', r.ikura_num,
        'goldenIkuraNum', r.golden_ikura_num,
        'goldenIkuraAssistNum', r.golden_ikura_assist_num,
        'scenarioCode', r.scenario_code,
		'waveDetails', (
			SELECT JSON_AGG(JSON_BUILD_OBJECT(
				'id', MD5(CONCAT_WS(':', TO_CHAR(r.play_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), r.uuid, w.wave_id)),
				'isClear', w.is_clear,
				'waveId', w.wave_id,
				'waterLevel', w.water_level,
				'eventType', w.event_type,
				'quotaNum', w.quota_num,
				'goldenIkuraNum', w.golden_ikura_num,
				'goldenIkuraPopNum', w.golden_ikura_pop_num
			))
			FROM waves w
			WHERE w.uuid = r.uuid AND w.play_time = r.play_time
		),
		'myResult', (
			SELECT JSON_BUILD_OBJECT(
				'id', MD5(CONCAT_WS(':', TO_CHAR(p.play_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), p.uuid, p.npln_user_id)),
				'name', p.name,
				'byname', p.byname,
				'nameId', p.name_id,
				'nameplate', JSON_BUILD_OBJECT(
					'badges', (
						SELECT ARRAY(
							SELECT CASE
								WHEN v = -1 THEN NULL
								ELSE v
							END
						FROM UNNEST(p.badges) AS v
						)
					),
					'background', JSON_BUILD_OBJECT(
						'id', p.nameplate,
						'textColor', JSON_BUILD_OBJECT(
							'r', p.text_color[1],
							'g', p.text_color[2],
							'b', p.text_color[3],
							'a', p.text_color[4]
						)
					)
				),
				'uniform', p.uniform,
				'species', p.species,
				'weaponList', p.weapon_list,
				'nplnUserId', p.npln_user_id,
				'specialId', p.special_id,
				'ikuraNum', p.ikura_num,
				'goldenIkuraNum', p.golden_ikura_num,
				'goldenIkuraAssistNum', p.golden_ikura_assist_num,
				'helpCount', p.help_count,
				'deadCount', p.dead_count,
				'bossKillCountsTotal', p.boss_kill_counts_total,
				'isMyself', true,
				'smellMeter', p.smell_meter,
				'jobRate', p.job_rate,
				'jobBonus', p.job_bonus,
				'jobScore', p.job_score,
				'kumaPoint', p.kuma_point,
				'gradeId', p.grade_id,
				'gradePoint', p.grade_point,
				'bossKillCounts', (
					SELECT ARRAY(
						SELECT CASE
							WHEN v = -1 THEN NULL
							ELSE v
						END
					FROM UNNEST(p.boss_kill_counts) AS v
					)
				),
				'specialCounts', p.special_count
			)
			FROM players p
			WHERE p.uuid = r.uuid AND p.play_time = r.play_time AND p.npln_user_id = 'a7grz65rxkvhfsbwmxmm'
		),
		'otherResults', (
			SELECT JSON_AGG(JSON_BUILD_OBJECT(
				'id', MD5(CONCAT_WS(':', TO_CHAR(p.play_time, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ'), p.uuid, p.npln_user_id)),
				'name', p.name,
				'byname', p.byname,
				'nameId', p.name_id,
				'nameplate', JSON_BUILD_OBJECT(
					'badges', (
						SELECT ARRAY(
							SELECT CASE
								WHEN v = -1 THEN NULL
								ELSE v
							END
						FROM UNNEST(p.badges) AS v
						)
					),
					'background', JSON_BUILD_OBJECT(
						'id', p.nameplate,
						'textColor', JSON_BUILD_OBJECT(
							'r', p.text_color[1],
							'g', p.text_color[2],
							'b', p.text_color[3],
							'a', p.text_color[4]
						)
					)
				),
				'uniform', p.uniform,
				'species', p.species,
				'weaponList', p.weapon_list,
				'nplnUserId', p.npln_user_id,
				'specialId', p.special_id,
				'ikuraNum', p.ikura_num,
				'goldenIkuraNum', p.golden_ikura_num,
				'goldenIkuraAssistNum', p.golden_ikura_assist_num,
				'helpCount', p.help_count,
				'deadCount', p.dead_count,
				'bossKillCountsTotal', p.boss_kill_counts_total,
				'isMyself', false,
				'smellMeter', p.smell_meter,
				'jobRate', p.job_rate,
				'jobBonus', p.job_bonus,
				'jobScore', p.job_score,
				'kumaPoint', p.kuma_point,
				'gradeId', p.grade_id,
				'gradePoint', p.grade_point,
				'bossKillCounts', (
					SELECT ARRAY(
						SELECT CASE
							WHEN v = -1 THEN NULL
							ELSE v
						END
					FROM UNNEST(p.boss_kill_counts) AS v
					)
				),
				'specialCounts', p.special_count
			))
			FROM players p
			WHERE p.uuid = r.uuid AND p.play_time = r.play_time AND p.npln_user_id != 'a7grz65rxkvhfsbwmxmm'
		)
    )) AS results
FROM
    schedules AS s
LEFT JOIN results AS r ON s.schedule_id = r.schedule_id
LEFT JOIN waves AS w ON r.uuid = w.uuid AND r.play_time = w.play_time
LEFT JOIN players AS p ON r.uuid = p.uuid AND r.play_time = p.play_time
WHERE
    'a7grz65rxkvhfsbwmxmm' = ANY(r.members)
AND
	s.start_time IS NOT NULL
GROUP BY
    s.schedule_id;
