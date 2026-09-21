source("R/mapRegionData.R")

library(sf)
library(dplyr)
library(ggplot2)



bavaria <- st_read("/Users/edgar/Development/apps/dash-board-mfe/src/data/bavaria-districts.json")


geo <- bavaria %>%
  mutate(
    RS = id |>
      sub("^.*\\.", "", x = _) |>
      substr(1, 5)
  )


map_data <- geo |>
    dplyr::left_join(
      data,
      by = "RS"
    )


low_colour <- "#F1F5F8"
mid_colour <- "#8FB8CE"
high_colour <- "#155A8A"
text_colour <- "#172B3A"
background_colour <- "white"


feature_grid_selected <- "Schw"

map_data <- map_data |> dplyr::filter(regierungen == feature_grid_selected)

map_data

# Depeding on which indicator: students, class size, etc.
ploti <- ggplot2::ggplot() +
  ggplot2::geom_sf(
    data = map_data,
    ggplot2::aes(fill = migrant_percent),
    colour = background_colour,
    linewidth = 0.3
  ) +
  ggplot2::scale_fill_gradientn(
    colours = c(
      low_colour,
      mid_colour,
      high_colour
    ),
    name = "Anzahl an ... Add Indicator",
    breaks = scales::pretty_breaks(n = 6),
    labels = scales::label_number(
      accuracy = 0.1,
      decimal.mark = ","
    ),
    na.value = "#D9DDE0",
    guide = ggplot2::guide_colourbar(
      title.position = "top",
      title.hjust = 0,
      label.position = "bottom",
      barwidth = ggplot2::unit(11, "cm"),
      barheight = ggplot2::unit(0.45, "cm"),
      ticks = TRUE,
      ticks.colour = text_colour,
      frame.colour = NA,
      nbin = 256
    )
  ) +
  ggplot2::labs(
    x = NULL,
    y = NULL
  ) +
  ggplot2::coord_sf(
    datum = NA,
    expand = TRUE,
    clip = "off"
  ) +
  ggplot2::theme(
    axis.text = ggplot2::element_blank(),
    axis.title = ggplot2::element_blank(),
    panel.background = ggplot2::element_blank(),
    
    legend.position = "bottom",
    legend.direction = "horizontal",
    legend.justification = "center",
    legend.title = ggplot2::element_text(
      colour = text_colour,
      face = "bold",
      size = 9,
      hjust = 0
    ),
    legend.text = ggplot2::element_text(
      colour = text_colour,
      size = 8
    ),
    legend.key.width = ggplot2::unit(
      0.8,
      "cm"
    ),
    legend.key.height = ggplot2::unit(
      0.4,
      "cm"
    ),
    legend.spacing.x = ggplot2::unit(
      0.15,
      "cm"
    ),
    legend.margin = ggplot2::margin(
      t = 4,
      r = 0,
      b = 0,
      l = 0
    ),
    
    plot.caption = ggplot2::element_text(
      colour = text_colour,
      size = 8,
      hjust = 0
    ),
    plot.margin = ggplot2::unit(
      c(0.1, 0.1, 0.1, 0.1),
      "cm"
    )
  )


ploti
