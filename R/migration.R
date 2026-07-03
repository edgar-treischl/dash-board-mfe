library(ggplot2)

data_german <- tibble::tribble(
     ~syear,                 ~stype,      ~group, ~number, ~year, ~total,      ~percentage,
  "2024/25",         "Grundschulen",  "Deutsche",      58, 2024L,    124, 46.7741935483871,
  "2024/25",         "Grundschulen", "Ausländer",      66, 2024L,    124, 53.2258064516129,
  "2024/25", "Mittel-/Hauptschulen",  "Deutsche",    1566, 2024L,   2654, 59.0052750565185,
  "2024/25", "Mittel-/Hauptschulen", "Ausländer",    1088, 2024L,   2654, 40.9947249434815,
  "2024/25",          "Realschulen",  "Deutsche",    6944, 2024L,   7874, 88.1889763779528,
  "2024/25",          "Realschulen", "Ausländer",     930, 2024L,   7874, 11.8110236220472,
  "2024/25",            "Gymnasien",  "Deutsche",    4440, 2024L,   5005, 88.7112887112887,
  "2024/25",            "Gymnasien", "Ausländer",     565, 2024L,   5005, 11.2887112887113,
  "2024/25",   "Int. Gesamtschulen",  "Deutsche",      11, 2024L,     16,            68.75,
  "2024/25",   "Int. Gesamtschulen", "Ausländer",       5, 2024L,     16,            31.25,
  "2023/24",         "Grundschulen",  "Deutsche",      55, 2023L,    118, 46.6101694915254,
  "2023/24",         "Grundschulen", "Ausländer",      63, 2023L,    118, 53.3898305084746,
  "2023/24", "Mittel-/Hauptschulen",  "Deutsche",    1385, 2023L,   2183, 63.4448007329363,
  "2023/24", "Mittel-/Hauptschulen", "Ausländer",     798, 2023L,   2183, 36.5551992670637,
  "2023/24",          "Realschulen",  "Deutsche",    6618, 2023L,   7360, 89.9184782608696,
  "2023/24",          "Realschulen", "Ausländer",     742, 2023L,   7360, 10.0815217391304,
  "2023/24",            "Gymnasien",  "Deutsche",    4470, 2023L,   5012, 89.1859537110934,
  "2023/24",            "Gymnasien", "Ausländer",     542, 2023L,   5012, 10.8140462889066,
  "2023/24",   "Int. Gesamtschulen",  "Deutsche",      30, 2023L,     32,            93.75,
  "2023/24",   "Int. Gesamtschulen", "Ausländer",       2, 2023L,     32,             6.25,
  "2022/23",         "Grundschulen",  "Deutsche",      88, 2022L,    147, 59.8639455782313,
  "2022/23",         "Grundschulen", "Ausländer",      59, 2022L,    147, 40.1360544217687,
  "2022/23", "Mittel-/Hauptschulen",  "Deutsche",    1539, 2022L,   2256,  68.218085106383,
  "2022/23", "Mittel-/Hauptschulen", "Ausländer",     717, 2022L,   2256,  31.781914893617,
  "2022/23",          "Realschulen",  "Deutsche",    7217, 2022L,   7995, 90.2689180737961,
  "2022/23",          "Realschulen", "Ausländer",     778, 2022L,   7995, 9.73108192620388,
  "2022/23",            "Gymnasien",  "Deutsche",    4622, 2022L,   5109, 90.4678019181836,
  "2022/23",            "Gymnasien", "Ausländer",     487, 2022L,   5109,  9.5321980818164,
  "2022/23",   "Int. Gesamtschulen",  "Deutsche",       5, 2022L,     NA,               NA,
  "2022/23",   "Int. Gesamtschulen", "Ausländer",      NA, 2022L,     NA,               NA,
  "2021/22",         "Grundschulen",  "Deutsche",      78, 2021L,    129, 60.4651162790698,
  "2021/22",         "Grundschulen", "Ausländer",      51, 2021L,    129, 39.5348837209302,
  "2021/22", "Mittel-/Hauptschulen",  "Deutsche",     998, 2021L,   1472, 67.7989130434783,
  "2021/22", "Mittel-/Hauptschulen", "Ausländer",     474, 2021L,   1472, 32.2010869565217,
  "2021/22",          "Realschulen",  "Deutsche",    1971, 2021L,   2151, 91.6317991631799,
  "2021/22",          "Realschulen", "Ausländer",     180, 2021L,   2151, 8.36820083682008,
  "2021/22",            "Gymnasien",  "Deutsche",    1325, 2021L,   1458,  90.877914951989,
  "2021/22",            "Gymnasien", "Ausländer",     133, 2021L,   1458, 9.12208504801097,
  "2021/22",   "Int. Gesamtschulen",  "Deutsche",       1, 2021L,     NA,               NA,
  "2021/22",   "Int. Gesamtschulen", "Ausländer",      NA, 2021L,     NA,               NA,
  "2020/21",         "Grundschulen",  "Deutsche",      42, 2020L,     81, 51.8518518518518,
  "2020/21",         "Grundschulen", "Ausländer",      39, 2020L,     81, 48.1481481481481,
  "2020/21", "Mittel-/Hauptschulen",  "Deutsche",     561, 2020L,    873, 64.2611683848797,
  "2020/21", "Mittel-/Hauptschulen", "Ausländer",     312, 2020L,    873, 35.7388316151203,
  "2020/21",          "Realschulen",  "Deutsche",     625, 2020L,    695, 89.9280575539568,
  "2020/21",          "Realschulen", "Ausländer",      70, 2020L,    695, 10.0719424460432,
  "2020/21",            "Gymnasien",  "Deutsche",     578, 2020L,    613, 94.2903752039152,
  "2020/21",            "Gymnasien", "Ausländer",      35, 2020L,    613, 5.70962479608483,
  "2020/21",   "Int. Gesamtschulen",  "Deutsche",       3, 2020L,     NA,               NA,
  "2020/21",   "Int. Gesamtschulen", "Ausländer",      NA, 2020L,     NA,               NA,
  "2019/20",         "Grundschulen",  "Deutsche",      84, 2019L,    151, 55.6291390728477,
  "2019/20",         "Grundschulen", "Ausländer",      67, 2019L,    151, 44.3708609271523,
  "2019/20", "Mittel-/Hauptschulen",  "Deutsche",    1884, 2019L,   2700, 69.7777777777778,
  "2019/20", "Mittel-/Hauptschulen", "Ausländer",     816, 2019L,   2700, 30.2222222222222,
  "2019/20",          "Realschulen",  "Deutsche",    6851, 2019L,   7393, 92.6687407006628,
  "2019/20",          "Realschulen", "Ausländer",     542, 2019L,   7393, 7.33125929933721,
  "2019/20",            "Gymnasien",  "Deutsche",    4239, 2019L,   4577, 92.6152501638628,
  "2019/20",            "Gymnasien", "Ausländer",     338, 2019L,   4577, 7.38474983613721,
  "2019/20",   "Int. Gesamtschulen",  "Deutsche",      26, 2019L,     31, 83.8709677419355,
  "2019/20",   "Int. Gesamtschulen", "Ausländer",       5, 2019L,     31, 16.1290322580645,
  "2018/19",         "Grundschulen",  "Deutsche",     135, 2018L,    258, 52.3255813953488,
  "2018/19",         "Grundschulen", "Ausländer",     123, 2018L,    258, 47.6744186046512,
  "2018/19", "Mittel-/Hauptschulen",  "Deutsche",    1913, 2018L,   2703, 70.7732149463559,
  "2018/19", "Mittel-/Hauptschulen", "Ausländer",     790, 2018L,   2703, 29.2267850536441,
  "2018/19",          "Realschulen",  "Deutsche",    7203, 2018L,   7716, 93.3514774494557,
  "2018/19",          "Realschulen", "Ausländer",     513, 2018L,   7716, 6.64852255054432,
  "2018/19",            "Gymnasien",  "Deutsche",    4519, 2018L,   4863, 92.9261772568373,
  "2018/19",            "Gymnasien", "Ausländer",     344, 2018L,   4863, 7.07382274316266,
  "2018/19",   "Int. Gesamtschulen",  "Deutsche",      22, 2018L,     27, 81.4814814814815,
  "2018/19",   "Int. Gesamtschulen", "Ausländer",       5, 2018L,     27, 18.5185185185185
  )


# Make a simple/minimal charts for German vs. Foreigners
library(dplyr)

data_german |>
  filter(syear == "2024/25") |>
  ggplot(aes(x = stype, y = percentage, fill = group)) +
  geom_col(
    width = 0.65,
    color = "white",
    linewidth = 1
  ) +
  scale_fill_brewer(palette = "Set1") +
  scale_y_continuous(
    labels = scales::label_percent(scale = 1),
    expand = c(0, 0)
  ) +
  labs(
    x = NULL,
    y = NULL
  ) +
  theme_minimal(base_size = 12) +
  theme(
    panel.grid.major.x = element_blank(),
    panel.grid.minor = element_blank(),
    panel.grid.major.y = element_line(
      color = "grey90",
      linewidth = 0.3
    ),
    axis.text.x = element_text(face = "bold"),
    legend.position = "bottom",
    legend.title = element_blank(),
    plot.margin = margin(20, 20, 20, 20)
  )+
  coord_flip()
