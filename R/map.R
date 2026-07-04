library(sf)
library(giscoR)
library(dplyr)
library(ggplot2)

# NUTS-Regionen laden
nuts <- gisco_get_nuts(year = "2021", resolution = "20")

# Regierungsbezirke Bayerns (NUTS2) > save in APP
bayern_rb <- nuts %>%
  filter(CNTR_CODE == "DE",
         LEVL_CODE == 2,
         grepl("^DE2", NUTS_ID))

bayern_rb

## Beispiel-Daten für die Metrik

daten <- data.frame(
  regierungsbezirk = c(
    "Oberbayern",
    "Niederbayern",
    "Oberpfalz",
    "Oberfranken",
    "Mittelfranken",
    "Unterfranken",
    "Schwaben"
  ),
  metric = c(12, 8, 15, 20, 5, 17, 10)
)

karte <- bayern_rb %>%
  left_join(daten, by = c("NAME_LATN" = "regierungsbezirk"))


# User picks a metric and app displays:
ggplot(karte) +
  geom_sf(aes(fill = metric), color = "white", linewidth = 0.5) +
  scale_fill_viridis_c(na.value = "grey90") +
  theme_void() +
  labs(fill = "Metrik",
        title = "Metrik nach Regierungsbezirk in Bayern",
        y = "New Label"
    )

