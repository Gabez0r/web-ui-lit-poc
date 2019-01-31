import { html } from 'lit-element';

export const LayoutStyles = html`
  <style>
    /* flex layout */
    .horizontal {
      display: flex;
      flex-direction: row;
    }
    .vertical {
      display: flex;
      flex-direction: column;
    }
    .wrap {
      flex-wrap: wrap;
    }
    .start {
      align-items: flex-start;
    }
    .center {
      align-items: center;
    }
    .end {
      align-items: flex-end;
    }
    .baseline {
      align-items: baseline;
    }
    .start-justified {
      justify-content: flex-start;
    }
    .center-justified {
      justify-content: center;
    }
    .end-justified {
      justify-content: flex-end;
    }
    .justified {
      justify-content: space-between;
    }
    .center-center {
      align-items: center;
      justify-content: center;
    }
    .flex {
      flex: 1 1 auto;
    }
    .flex2 {
      flex: 2;
    }
    .flex3 {
      flex: 3;
    }
    .flex4 {
      flex: 4;
    }
    .flex5 {
      flex: 5;
    }
    /* grid layout */
    .grid {
      display: grid;
    }
  </style>
`;
