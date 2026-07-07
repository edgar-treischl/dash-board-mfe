#read SAmt-generated.json

library(jsonlite)

samtdata <- fromJSON("src/data/SAmt-generated.json")

schul_samt <- samtdata$SCHULEN

schul_samt$veraDeu

#Make a boxplot for veraDeu
library(ggplot2)

ggplot(schul_samt, aes(x = "", y = veraDeu)) +
  geom_boxplot() +
  labs(title = "Boxplot of veraDeu Scores", y = "veraDeu Scores") +
  theme_minimal() +
  facet_wrap(~ sozialindex, ncol = 5)


# Make beeswarm plot for veraDeu
library(ggbeeswarm)

ggplot(schul_samt, aes(x = sozialindex, y = veraDeu, color = sozialindex)) +
  geom_beeswarm(size = 1.5, alpha = 0.7) +
  labs(title = "Beeswarm Plot of veraDeu Scores by Sozialindex") +
  theme_minimal() +
  theme(axis.text.x = element_text(angle = 45, hjust = 1))


schul_samt$veraDeuHist

veraDeuHistLong <- schul_samt |> 
  dplyr::select(id, veraDeuHist) |>
  tidyr::unnest(veraDeuHist) 


veraDeuHistLong



df <- tidyr::tribble(
   ~times, ~country, ~gdp, ~inc,
   "1990", "A", 22.3, TRUE,
   "2000", "A", 44.6, TRUE,
   "1990", "B", 12.3, FALSE,
   "2000", "B", 4.6, FALSE
)

ggplot2::ggplot(df, ggplot2::aes(
    x = times,
    y = gdp,
    group = country,
    color = inc,
  )) +
    ggplot2::geom_line() +
    # left side y axis labels
    ggrepel::geom_text_repel(
      data = df |> dplyr::filter(times == min(times)),
      ggplot2::aes(label = country),
      hjust = "left",
      box.padding = 0.10,
      point.padding = 0.10,
      segment.color = "gray",
      segment.alpha = 0.6,
      fontface = "bold",
      size = 3,
      nudge_x = -1.95,
      direction = "y",
      force = .5,
      max.iter = 3000
    ) +
    ggrepel::geom_text_repel(
      data = df |> dplyr::filter(times == max(times)),
      ggplot2::aes(label = country),
      hjust = "right",
      box.padding = 0.10,
      point.padding = 0.10,
      segment.color = "gray",
      segment.alpha = 0.6,
      fontface = "bold",
      size = 3,
      nudge_x = 1.95,
      direction = "y",
      force = .5,
      max.iter = 3000
    ) +
    ggplot2::geom_text(ggplot2::aes(label = gdp),
      size = 2.5
    )

