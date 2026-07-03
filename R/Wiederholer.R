df <- tibble::tribble(
     ~syear,                                   ~stype,      ~group, ~number, ~year,
  "2024/25",                           "Grundschulen",  "Männlich",    "67", 2024L,
  "2024/25",                           "Grundschulen",  "Weiblich",    "57", 2024L,
  "2024/25",                           "Grundschulen",  "Deutsche",    "58", 2024L,
  "2024/25",                           "Grundschulen", "Ausländer",    "66", 2024L,
  "2024/25",                           "Grundschulen", "Insgesamt",   "124", 2024L,
  "2024/25",                   "Mittel-/Hauptschulen",  "Männlich",  "1652", 2024L,
  "2024/25",                   "Mittel-/Hauptschulen",  "Weiblich",  "1002", 2024L,
  "2024/25",                   "Mittel-/Hauptschulen",  "Deutsche",  "1566", 2024L,
  "2024/25",                   "Mittel-/Hauptschulen", "Ausländer",  "1088", 2024L,
  "2024/25",                   "Mittel-/Hauptschulen", "Insgesamt",  "2654", 2024L,
  "2024/25",                            "Realschulen",  "Männlich",  "4642", 2024L,
  "2024/25",                            "Realschulen",  "Weiblich",  "3232", 2024L,
  "2024/25",                            "Realschulen",  "Deutsche",  "6944", 2024L,
  "2024/25",                            "Realschulen", "Ausländer",   "930", 2024L,
  "2024/25",                            "Realschulen", "Insgesamt",  "7874", 2024L,
  "2024/25",                              "Gymnasien",  "Männlich",  "2995", 2024L,
  "2024/25",                              "Gymnasien",  "Weiblich",  "2010", 2024L,
  "2024/25",                              "Gymnasien",  "Deutsche",  "4440", 2024L,
  "2024/25",                              "Gymnasien", "Ausländer",   "565", 2024L,
  "2024/25",                              "Gymnasien", "Insgesamt",  "5005", 2024L,
  "2024/25", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2024L,
  "2024/25", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2024L,
  "2024/25", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2024L,
  "2024/25", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2024L,
  "2024/25", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2024L,
  "2024/25",              "Int. Gesamtschulen",  "Männlich",    "11", 2024L,
  "2024/25",              "Int. Gesamtschulen",  "Weiblich",     "5", 2024L,
  "2024/25",              "Int. Gesamtschulen",  "Deutsche",    "11", 2024L,
  "2024/25",              "Int. Gesamtschulen", "Ausländer",     "5", 2024L,
  "2024/25",              "Int. Gesamtschulen", "Insgesamt",    "16", 2024L,
  "2023/24",                           "Grundschulen",  "Männlich",    "67", 2023L,
  "2023/24",                           "Grundschulen",  "Weiblich",    "51", 2023L,
  "2023/24",                           "Grundschulen",  "Deutsche",    "55", 2023L,
  "2023/24",                           "Grundschulen", "Ausländer",    "63", 2023L,
  "2023/24",                           "Grundschulen", "Insgesamt",   "118", 2023L,
  "2023/24",                   "Mittel-/Hauptschulen",  "Männlich",  "1372", 2023L,
  "2023/24",                   "Mittel-/Hauptschulen",  "Weiblich",   "811", 2023L,
  "2023/24",                   "Mittel-/Hauptschulen",  "Deutsche",  "1385", 2023L,
  "2023/24",                   "Mittel-/Hauptschulen", "Ausländer",   "798", 2023L,
  "2023/24",                   "Mittel-/Hauptschulen", "Insgesamt",  "2183", 2023L,
  "2023/24",                            "Realschulen",  "Männlich",  "4301", 2023L,
  "2023/24",                            "Realschulen",  "Weiblich",  "3059", 2023L,
  "2023/24",                            "Realschulen",  "Deutsche",  "6618", 2023L,
  "2023/24",                            "Realschulen", "Ausländer",   "742", 2023L,
  "2023/24",                            "Realschulen", "Insgesamt",  "7360", 2023L,
  "2023/24",                              "Gymnasien",  "Männlich",  "2910", 2023L,
  "2023/24",                              "Gymnasien",  "Weiblich",  "2102", 2023L,
  "2023/24",                              "Gymnasien",  "Deutsche",  "4470", 2023L,
  "2023/24",                              "Gymnasien", "Ausländer",   "542", 2023L,
  "2023/24",                              "Gymnasien", "Insgesamt",  "5012", 2023L,
  "2023/24", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2023L,
  "2023/24", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2023L,
  "2023/24", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2023L,
  "2023/24", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2023L,
  "2023/24", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2023L,
  "2023/24",              "Int. Gesamtschulen",  "Männlich",    "21", 2023L,
  "2023/24",              "Int. Gesamtschulen",  "Weiblich",    "11", 2023L,
  "2023/24",              "Int. Gesamtschulen",  "Deutsche",    "30", 2023L,
  "2023/24",              "Int. Gesamtschulen", "Ausländer",     "2", 2023L,
  "2023/24",              "Int. Gesamtschulen", "Insgesamt",    "32", 2023L,
  "2022/23",                           "Grundschulen",  "Männlich",    "80", 2022L,
  "2022/23",                           "Grundschulen",  "Weiblich",    "67", 2022L,
  "2022/23",                           "Grundschulen",  "Deutsche",    "88", 2022L,
  "2022/23",                           "Grundschulen", "Ausländer",    "59", 2022L,
  "2022/23",                           "Grundschulen", "Insgesamt",   "147", 2022L,
  "2022/23",                   "Mittel-/Hauptschulen",  "Männlich",  "1433", 2022L,
  "2022/23",                   "Mittel-/Hauptschulen",  "Weiblich",   "823", 2022L,
  "2022/23",                   "Mittel-/Hauptschulen",  "Deutsche",  "1539", 2022L,
  "2022/23",                   "Mittel-/Hauptschulen", "Ausländer",   "717", 2022L,
  "2022/23",                   "Mittel-/Hauptschulen", "Insgesamt",  "2256", 2022L,
  "2022/23",                            "Realschulen",  "Männlich",  "4785", 2022L,
  "2022/23",                            "Realschulen",  "Weiblich",  "3210", 2022L,
  "2022/23",                            "Realschulen",  "Deutsche",  "7217", 2022L,
  "2022/23",                            "Realschulen", "Ausländer",   "778", 2022L,
  "2022/23",                            "Realschulen", "Insgesamt",  "7995", 2022L,
  "2022/23",                              "Gymnasien",  "Männlich",  "2933", 2022L,
  "2022/23",                              "Gymnasien",  "Weiblich",  "2176", 2022L,
  "2022/23",                              "Gymnasien",  "Deutsche",  "4622", 2022L,
  "2022/23",                              "Gymnasien", "Ausländer",   "487", 2022L,
  "2022/23",                              "Gymnasien", "Insgesamt",  "5109", 2022L,
  "2022/23", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2022L,
  "2022/23", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2022L,
  "2022/23", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2022L,
  "2022/23", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2022L,
  "2022/23", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2022L,
  "2022/23",              "Int. Gesamtschulen",  "Männlich",     "2", 2022L,
  "2022/23",              "Int. Gesamtschulen",  "Weiblich",     "3", 2022L,
  "2022/23",              "Int. Gesamtschulen",  "Deutsche",     "5", 2022L,
  "2022/23",              "Int. Gesamtschulen", "Ausländer",     "-", 2022L,
  "2022/23",              "Int. Gesamtschulen", "Insgesamt",     "5", 2022L,
  "2021/22",                           "Grundschulen",  "Männlich",    "77", 2021L,
  "2021/22",                           "Grundschulen",  "Weiblich",    "52", 2021L,
  "2021/22",                           "Grundschulen",  "Deutsche",    "78", 2021L,
  "2021/22",                           "Grundschulen", "Ausländer",    "51", 2021L,
  "2021/22",                           "Grundschulen", "Insgesamt",   "129", 2021L,
  "2021/22",                   "Mittel-/Hauptschulen",  "Männlich",   "962", 2021L,
  "2021/22",                   "Mittel-/Hauptschulen",  "Weiblich",   "510", 2021L,
  "2021/22",                   "Mittel-/Hauptschulen",  "Deutsche",   "998", 2021L,
  "2021/22",                   "Mittel-/Hauptschulen", "Ausländer",   "474", 2021L,
  "2021/22",                   "Mittel-/Hauptschulen", "Insgesamt",  "1472", 2021L,
  "2021/22",                            "Realschulen",  "Männlich",  "1360", 2021L,
  "2021/22",                            "Realschulen",  "Weiblich",   "791", 2021L,
  "2021/22",                            "Realschulen",  "Deutsche",  "1971", 2021L,
  "2021/22",                            "Realschulen", "Ausländer",   "180", 2021L,
  "2021/22",                            "Realschulen", "Insgesamt",  "2151", 2021L,
  "2021/22",                              "Gymnasien",  "Männlich",   "935", 2021L,
  "2021/22",                              "Gymnasien",  "Weiblich",   "523", 2021L,
  "2021/22",                              "Gymnasien",  "Deutsche",  "1325", 2021L,
  "2021/22",                              "Gymnasien", "Ausländer",   "133", 2021L,
  "2021/22",                              "Gymnasien", "Insgesamt",  "1458", 2021L,
  "2021/22", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2021L,
  "2021/22", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2021L,
  "2021/22", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2021L,
  "2021/22", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2021L,
  "2021/22", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2021L,
  "2021/22",              "Int. Gesamtschulen",  "Männlich",     "1", 2021L,
  "2021/22",              "Int. Gesamtschulen",  "Weiblich",     "-", 2021L,
  "2021/22",              "Int. Gesamtschulen",  "Deutsche",     "1", 2021L,
  "2021/22",              "Int. Gesamtschulen", "Ausländer",     "-", 2021L,
  "2021/22",              "Int. Gesamtschulen", "Insgesamt",     "1", 2021L,
  "2020/21",                           "Grundschulen",  "Männlich",    "46", 2020L,
  "2020/21",                           "Grundschulen",  "Weiblich",    "35", 2020L,
  "2020/21",                           "Grundschulen",  "Deutsche",    "42", 2020L,
  "2020/21",                           "Grundschulen", "Ausländer",    "39", 2020L,
  "2020/21",                           "Grundschulen", "Insgesamt",    "81", 2020L,
  "2020/21",                   "Mittel-/Hauptschulen",  "Männlich",   "572", 2020L,
  "2020/21",                   "Mittel-/Hauptschulen",  "Weiblich",   "301", 2020L,
  "2020/21",                   "Mittel-/Hauptschulen",  "Deutsche",   "561", 2020L,
  "2020/21",                   "Mittel-/Hauptschulen", "Ausländer",   "312", 2020L,
  "2020/21",                   "Mittel-/Hauptschulen", "Insgesamt",   "873", 2020L,
  "2020/21",                            "Realschulen",  "Männlich",   "439", 2020L,
  "2020/21",                            "Realschulen",  "Weiblich",   "256", 2020L,
  "2020/21",                            "Realschulen",  "Deutsche",   "625", 2020L,
  "2020/21",                            "Realschulen", "Ausländer",    "70", 2020L,
  "2020/21",                            "Realschulen", "Insgesamt",   "695", 2020L,
  "2020/21",                              "Gymnasien",  "Männlich",   "390", 2020L,
  "2020/21",                              "Gymnasien",  "Weiblich",   "223", 2020L,
  "2020/21",                              "Gymnasien",  "Deutsche",   "578", 2020L,
  "2020/21",                              "Gymnasien", "Ausländer",    "35", 2020L,
  "2020/21",                              "Gymnasien", "Insgesamt",   "613", 2020L,
  "2020/21", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2020L,
  "2020/21", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2020L,
  "2020/21", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2020L,
  "2020/21", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2020L,
  "2020/21", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2020L,
  "2020/21",              "Int. Gesamtschulen",  "Männlich",     "2", 2020L,
  "2020/21",              "Int. Gesamtschulen",  "Weiblich",     "1", 2020L,
  "2020/21",              "Int. Gesamtschulen",  "Deutsche",     "3", 2020L,
  "2020/21",              "Int. Gesamtschulen", "Ausländer",     "-", 2020L,
  "2020/21",              "Int. Gesamtschulen", "Insgesamt",     "3", 2020L,
  "2019/20",                           "Grundschulen",  "Männlich",    "93", 2019L,
  "2019/20",                           "Grundschulen",  "Weiblich",    "58", 2019L,
  "2019/20",                           "Grundschulen",  "Deutsche",    "84", 2019L,
  "2019/20",                           "Grundschulen", "Ausländer",    "67", 2019L,
  "2019/20",                           "Grundschulen", "Insgesamt",   "151", 2019L,
  "2019/20",                   "Mittel-/Hauptschulen",  "Männlich",  "1865", 2019L,
  "2019/20",                   "Mittel-/Hauptschulen",  "Weiblich",   "835", 2019L,
  "2019/20",                   "Mittel-/Hauptschulen",  "Deutsche",  "1884", 2019L,
  "2019/20",                   "Mittel-/Hauptschulen", "Ausländer",   "816", 2019L,
  "2019/20",                   "Mittel-/Hauptschulen", "Insgesamt",  "2700", 2019L,
  "2019/20",                            "Realschulen",  "Männlich",  "4788", 2019L,
  "2019/20",                            "Realschulen",  "Weiblich",  "2605", 2019L,
  "2019/20",                            "Realschulen",  "Deutsche",  "6851", 2019L,
  "2019/20",                            "Realschulen", "Ausländer",   "542", 2019L,
  "2019/20",                            "Realschulen", "Insgesamt",  "7393", 2019L,
  "2019/20",                              "Gymnasien",  "Männlich",  "2874", 2019L,
  "2019/20",                              "Gymnasien",  "Weiblich",  "1703", 2019L,
  "2019/20",                              "Gymnasien",  "Deutsche",  "4239", 2019L,
  "2019/20",                              "Gymnasien", "Ausländer",   "338", 2019L,
  "2019/20",                              "Gymnasien", "Insgesamt",  "4577", 2019L,
  "2019/20", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2019L,
  "2019/20", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2019L,
  "2019/20", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2019L,
  "2019/20", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2019L,
  "2019/20", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2019L,
  "2019/20",              "Int. Gesamtschulen",  "Männlich",    "16", 2019L,
  "2019/20",              "Int. Gesamtschulen",  "Weiblich",    "15", 2019L,
  "2019/20",              "Int. Gesamtschulen",  "Deutsche",    "26", 2019L,
  "2019/20",              "Int. Gesamtschulen", "Ausländer",     "5", 2019L,
  "2019/20",              "Int. Gesamtschulen", "Insgesamt",    "31", 2019L,
  "2018/19",                           "Grundschulen",  "Männlich",   "131", 2018L,
  "2018/19",                           "Grundschulen",  "Weiblich",   "127", 2018L,
  "2018/19",                           "Grundschulen",  "Deutsche",   "135", 2018L,
  "2018/19",                           "Grundschulen", "Ausländer",   "123", 2018L,
  "2018/19",                           "Grundschulen", "Insgesamt",   "258", 2018L,
  "2018/19",                   "Mittel-/Hauptschulen",  "Männlich",  "1882", 2018L,
  "2018/19",                   "Mittel-/Hauptschulen",  "Weiblich",   "821", 2018L,
  "2018/19",                   "Mittel-/Hauptschulen",  "Deutsche",  "1913", 2018L,
  "2018/19",                   "Mittel-/Hauptschulen", "Ausländer",   "790", 2018L,
  "2018/19",                   "Mittel-/Hauptschulen", "Insgesamt",  "2703", 2018L,
  "2018/19",                            "Realschulen",  "Männlich",  "4961", 2018L,
  "2018/19",                            "Realschulen",  "Weiblich",  "2755", 2018L,
  "2018/19",                            "Realschulen",  "Deutsche",  "7203", 2018L,
  "2018/19",                            "Realschulen", "Ausländer",   "513", 2018L,
  "2018/19",                            "Realschulen", "Insgesamt",  "7716", 2018L,
  "2018/19",                              "Gymnasien",  "Männlich",  "3078", 2018L,
  "2018/19",                              "Gymnasien",  "Weiblich",  "1785", 2018L,
  "2018/19",                              "Gymnasien",  "Deutsche",  "4519", 2018L,
  "2018/19",                              "Gymnasien", "Ausländer",   "344", 2018L,
  "2018/19",                              "Gymnasien", "Insgesamt",  "4863", 2018L,
  "2018/19", "Schulartunabhängige Orientierungsstufe",  "Männlich",     "-", 2018L,
  "2018/19", "Schulartunabhängige Orientierungsstufe",  "Weiblich",     "-", 2018L,
  "2018/19", "Schulartunabhängige Orientierungsstufe",  "Deutsche",     "-", 2018L,
  "2018/19", "Schulartunabhängige Orientierungsstufe", "Ausländer",     "-", 2018L,
  "2018/19", "Schulartunabhängige Orientierungsstufe", "Insgesamt",     "-", 2018L,
  "2018/19",              "Int. Gesamtschulen",  "Männlich",    "16", 2018L,
  "2018/19",              "Int. Gesamtschulen",  "Weiblich",    "11", 2018L,
  "2018/19",              "Int. Gesamtschulen",  "Deutsche",    "22", 2018L,
  "2018/19",              "Int. Gesamtschulen", "Ausländer",     "5", 2018L,
  "2018/19",              "Int. Gesamtschulen", "Insgesamt",    "27", 2018L
  )


# Make ggplot for differences between male and female

library(ggplot2)
library(dplyr)

df$number <- as.numeric(df$number)

df_gesamt <- df |>
  dplyr::filter(group == "Insgesamt") |>
  dplyr::filter(stype != "Schulartunabhängige Orientierungsstufe") |>
  dplyr::group_by(syear) |>
  dplyr::mutate(n_overall = sum(number),
                percent = number/n_overall*100)


# Sex: Let User pick a Year

sexdf <- df |> dplyr::filter(group %in% c("Männlich", "Weiblich")) |>
  dplyr::filter(stype != "Schulartunabhängige Orientierungsstufe") |>
  dplyr::group_by(stype, syear) |>
  dplyr::mutate(total = sum(number),
                percentage = number / total * 100)


sex_df <- df |>
  dplyr::filter(group %in% c("Männlich", "Weiblich")) |>
  dplyr::filter(year == 2024) |>
  dplyr::filter(stype != "Schulartunabhängige Orientierungsstufe") |>
  dplyr::group_by(stype) |>
  dplyr::mutate(total = sum(number),
                percentage = number / total * 100)

sex_df <- sex_df |>
  mutate(stype = factor(stype, levels = sort(unique(stype))))

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
    axis.text.x = element_text(angle = 20, hjust = 1),
    legend.position = "top"
  )



# Sex: Let User pick a Year


data_german <- df |>
  dplyr::filter(group %in% c("Deutsche", "Ausländer")) |>
  #dplyr::filter(year == 2024) |>
  dplyr::filter(stype != "Schulartunabhängige Orientierungsstufe") |>
  dplyr::mutate(number = as.numeric(number)) |>
  dplyr::group_by(syear, stype) |>
  dplyr::mutate(total = sum(number),
                percentage = number / total * 100)


# Make a simple/minimal donut charts for German vs. Foreigners

data_german |>
  ggplot(aes(x = 2, y = percentage, fill = group)) +
  geom_col(color = "white", linewidth = 2) +
  coord_polar(theta = "y") +
  xlim(0.8, 2.5) +
  scale_fill_brewer(palette = "Set1") +
  theme_void() +
  theme(
    legend.position = "bottom",
    legend.title = element_blank(),
    plot.margin = margin(20, 20, 20, 20)
  ) +
  facet_wrap(stype ~ ., nrow=1)






