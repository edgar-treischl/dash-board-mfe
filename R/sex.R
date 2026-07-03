library(ggplot2)

sex_df <- tibble::tribble(
     ~syear,                 ~stype,     ~group, ~number, ~year, ~total,      ~percentage,
  "2024/25",         "Grundschulen", "Männlich",      67, 2024L,    124, 54.0322580645161,
  "2024/25",         "Grundschulen", "Weiblich",      57, 2024L,    124, 45.9677419354839,
  "2024/25", "Mittel-/Hauptschulen", "Männlich",    1652, 2024L,   2654, 62.2456669178598,
  "2024/25", "Mittel-/Hauptschulen", "Weiblich",    1002, 2024L,   2654, 37.7543330821402,
  "2024/25",          "Realschulen", "Männlich",    4642, 2024L,   7874, 58.9535179070358,
  "2024/25",          "Realschulen", "Weiblich",    3232, 2024L,   7874, 41.0464820929642,
  "2024/25",            "Gymnasien", "Männlich",    2995, 2024L,   5005, 59.8401598401598,
  "2024/25",            "Gymnasien", "Weiblich",    2010, 2024L,   5005, 40.1598401598402,
  "2024/25",   "Int. Gesamtschulen", "Männlich",      11, 2024L,     16,            68.75,
  "2024/25",   "Int. Gesamtschulen", "Weiblich",       5, 2024L,     16,            31.25,
  "2023/24",         "Grundschulen", "Männlich",      67, 2023L,    118, 56.7796610169492,
  "2023/24",         "Grundschulen", "Weiblich",      51, 2023L,    118, 43.2203389830509,
  "2023/24", "Mittel-/Hauptschulen", "Männlich",    1372, 2023L,   2183,  62.849289967934,
  "2023/24", "Mittel-/Hauptschulen", "Weiblich",     811, 2023L,   2183,  37.150710032066,
  "2023/24",          "Realschulen", "Männlich",    4301, 2023L,   7360,          58.4375,
  "2023/24",          "Realschulen", "Weiblich",    3059, 2023L,   7360,          41.5625,
  "2023/24",            "Gymnasien", "Männlich",    2910, 2023L,   5012, 58.0606544293695,
  "2023/24",            "Gymnasien", "Weiblich",    2102, 2023L,   5012, 41.9393455706305,
  "2023/24",   "Int. Gesamtschulen", "Männlich",      21, 2023L,     32,           65.625,
  "2023/24",   "Int. Gesamtschulen", "Weiblich",      11, 2023L,     32,           34.375,
  "2022/23",         "Grundschulen", "Männlich",      80, 2022L,    147,  54.421768707483,
  "2022/23",         "Grundschulen", "Weiblich",      67, 2022L,    147,  45.578231292517,
  "2022/23", "Mittel-/Hauptschulen", "Männlich",    1433, 2022L,   2256, 63.5195035460993,
  "2022/23", "Mittel-/Hauptschulen", "Weiblich",     823, 2022L,   2256, 36.4804964539007,
  "2022/23",          "Realschulen", "Männlich",    4785, 2022L,   7995, 59.8499061913696,
  "2022/23",          "Realschulen", "Weiblich",    3210, 2022L,   7995, 40.1500938086304,
  "2022/23",            "Gymnasien", "Männlich",    2933, 2022L,   5109,  57.408494813075,
  "2022/23",            "Gymnasien", "Weiblich",    2176, 2022L,   5109,  42.591505186925,
  "2022/23",   "Int. Gesamtschulen", "Männlich",       2, 2022L,      5,               40,
  "2022/23",   "Int. Gesamtschulen", "Weiblich",       3, 2022L,      5,               60,
  "2021/22",         "Grundschulen", "Männlich",      77, 2021L,    129, 59.6899224806201,
  "2021/22",         "Grundschulen", "Weiblich",      52, 2021L,    129, 40.3100775193798,
  "2021/22", "Mittel-/Hauptschulen", "Männlich",     962, 2021L,   1472, 65.3532608695652,
  "2021/22", "Mittel-/Hauptschulen", "Weiblich",     510, 2021L,   1472, 34.6467391304348,
  "2021/22",          "Realschulen", "Männlich",    1360, 2021L,   2151, 63.2264063226406,
  "2021/22",          "Realschulen", "Weiblich",     791, 2021L,   2151, 36.7735936773594,
  "2021/22",            "Gymnasien", "Männlich",     935, 2021L,   1458, 64.1289437585734,
  "2021/22",            "Gymnasien", "Weiblich",     523, 2021L,   1458, 35.8710562414266,
  "2021/22",   "Int. Gesamtschulen", "Männlich",       1, 2021L,     NA,               NA,
  "2021/22",   "Int. Gesamtschulen", "Weiblich",      NA, 2021L,     NA,               NA,
  "2020/21",         "Grundschulen", "Männlich",      46, 2020L,     81, 56.7901234567901,
  "2020/21",         "Grundschulen", "Weiblich",      35, 2020L,     81, 43.2098765432099,
  "2020/21", "Mittel-/Hauptschulen", "Männlich",     572, 2020L,    873, 65.5211912943872,
  "2020/21", "Mittel-/Hauptschulen", "Weiblich",     301, 2020L,    873, 34.4788087056128,
  "2020/21",          "Realschulen", "Männlich",     439, 2020L,    695, 63.1654676258993,
  "2020/21",          "Realschulen", "Weiblich",     256, 2020L,    695, 36.8345323741007,
  "2020/21",            "Gymnasien", "Männlich",     390, 2020L,    613, 63.6215334420881,
  "2020/21",            "Gymnasien", "Weiblich",     223, 2020L,    613, 36.3784665579119,
  "2020/21",   "Int. Gesamtschulen", "Männlich",       2, 2020L,      3, 66.6666666666667,
  "2020/21",   "Int. Gesamtschulen", "Weiblich",       1, 2020L,      3, 33.3333333333333,
  "2019/20",         "Grundschulen", "Männlich",      93, 2019L,    151, 61.5894039735099,
  "2019/20",         "Grundschulen", "Weiblich",      58, 2019L,    151, 38.4105960264901,
  "2019/20", "Mittel-/Hauptschulen", "Männlich",    1865, 2019L,   2700, 69.0740740740741,
  "2019/20", "Mittel-/Hauptschulen", "Weiblich",     835, 2019L,   2700, 30.9259259259259,
  "2019/20",          "Realschulen", "Männlich",    4788, 2019L,   7393, 64.7639659137022,
  "2019/20",          "Realschulen", "Weiblich",    2605, 2019L,   7393, 35.2360340862978,
  "2019/20",            "Gymnasien", "Männlich",    2874, 2019L,   4577, 62.7922219794625,
  "2019/20",            "Gymnasien", "Weiblich",    1703, 2019L,   4577, 37.2077780205375,
  "2019/20",   "Int. Gesamtschulen", "Männlich",      16, 2019L,     31, 51.6129032258064,
  "2019/20",   "Int. Gesamtschulen", "Weiblich",      15, 2019L,     31, 48.3870967741936,
  "2018/19",         "Grundschulen", "Männlich",     131, 2018L,    258, 50.7751937984496,
  "2018/19",         "Grundschulen", "Weiblich",     127, 2018L,    258, 49.2248062015504,
  "2018/19", "Mittel-/Hauptschulen", "Männlich",    1882, 2018L,   2703, 69.6263411024787,
  "2018/19", "Mittel-/Hauptschulen", "Weiblich",     821, 2018L,   2703, 30.3736588975213,
  "2018/19",          "Realschulen", "Männlich",    4961, 2018L,   7716, 64.2949714878175,
  "2018/19",          "Realschulen", "Weiblich",    2755, 2018L,   7716, 35.7050285121825,
  "2018/19",            "Gymnasien", "Männlich",    3078, 2018L,   4863, 63.2942628007403,
  "2018/19",            "Gymnasien", "Weiblich",    1785, 2018L,   4863, 36.7057371992597,
  "2018/19",   "Int. Gesamtschulen", "Männlich",      16, 2018L,     27, 59.2592592592593,
  "2018/19",   "Int. Gesamtschulen", "Weiblich",      11, 2018L,     27, 40.7407407407407
  )



#let user pick a year
selected_year <- "2024/25"


sex_df <- sex_df |> dplyr::filter(syear == selected_year)

ggplot(sex_df, aes(x = stype, y = percentage, fill = group)) +
  geom_col(position = position_dodge(width = 0.8), width = 0.7) +
  labs(
    x = "Schulart",
    y = "Anteil Wiederholer (%)",
    title = "Wiederholer nach Geschlecht",
    fill = "Geschlecht"   # legend title
  ) +
  scale_fill_brewer(palette = "Set2") +
  theme_minimal(base_size = 13) +
  theme(
    plot.title = element_text(face = "bold", hjust = 0.5),
    legend.position = "bottom"
  ) +
  coord_flip()
