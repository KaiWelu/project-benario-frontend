export interface ColorScheme {
  id: string;
  name: string;
  getColor: (value: number) => string;
  breaks: number[];
}

export const COLOR_SCHEMES: Record<string, ColorScheme> = {
  votes_heatmap_absolute: {
    id: "votes_heatmap_absolute",
    name: "Absolute Vote Distribution Heatmap",
    getColor: (votes: number) => {
      if (votes > 250) return "#FFD93D";
      if (votes > 200) return "#450693";
      if (votes > 100) return "#FF3F7F";
      return "#cccccc";
    },
    breaks: [0, 100, 200, 250],
  },
  votes_heatmap_relative: {
    id: "votes_heatmap_relative",
    name: "Relative Vote Distribution Heatmap",
    getColor: (votes: number) => {
      if (votes > 300) return "#8B0000";
      if (votes > 200) return "#DC143C";
      if (votes > 100) return "#FF6347";
      if (votes > 50) return "#FFA07A";
      return "#FFE4E1";
    },
    breaks: [0, 50, 100, 200, 300],
  },
};
