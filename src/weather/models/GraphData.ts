export class GraphData {
  label: string;
  xValues: number[];
  xLabel: string;
  yValues: number[];
  yLabel: string;

  constructor() {
    this.xLabel = '';
    this.yLabel = '';
    this.xValues = [];
    this.yValues = [];
    this.label = "";
  }
}
