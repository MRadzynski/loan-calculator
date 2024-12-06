import axios from 'axios';
import xml2js from 'xml2js';

interface ReferenceRateTableRow {
  $: {
    id: string;
    nazwa: string;
    name: string;
    odnosnik?: string;
    oprocentowanie: string;
    trend: string;
    obowiazuje_od: string;
  };
}

interface ReferenceRateTable {
  $: {
    id: string;
    naglowek: string;
    header: string;
  };
  pozycja: ReferenceRateTableRow[];
}

interface ReferenceRateResponse {
  $: {
    data_publikacji: string;
  };
  tabela: ReferenceRateTable[];
  odnosniki?: {
    odnosnik: {
      $: {
        id: string;
        odnosnik: string;
        note: string;
      };
    }[];
  };
}

interface ApiResponse {
  stopy_procentowe: ReferenceRateResponse;
}

export const fetchReferenceRate = async () => {
  const response = await axios.get(
    'https://static.nbp.pl/dane/stopy/stopy_procentowe.xml'
  );
  const result: ApiResponse = await xml2js.parseStringPromise(response.data);

  const referenceRateData = result.stopy_procentowe.tabela[0].pozycja.find(
    pozycja => pozycja.$.nazwa === 'Stopa referencyjna'
  );

  return Number(referenceRateData?.$.oprocentowanie.replace(',', '.'));
};
