import { idToTestId } from "@/utils/commonUtils";
import XLSX from "xlsx";

// export const mindDataToExcelData = mindData => {
//   return [
//     ['name', 'age'],
//     ['nanoha', 16],
//     ['fate', 16]
//   ];
// };

export const excelFilename = (rootNodeName) => {
  return `${rootNodeName}.xlsx`;
};

export const mindDataToExcelDataEntire = (node, parentTopics = []) => {
  const currentTopic = node.topic;
  const currentRow = [...parentTopics, currentTopic];
  const rows = [currentRow];

  if (node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      rows.push(...mindDataToExcelDataEntire(childNode, currentRow));
    }
  } else {
    rows.push([...currentRow, '']);
  }

  return rows;
}

export const mindDataToExcelDataTestNode = (node, parentTopics = []) => {
  const currentTopic = node.topic;
  const currentRow = [...parentTopics, currentTopic];

  if (node.nodeType === 'test') {
    const currentId = idToTestId(node.id);
    const currentTags = Array.isArray(node.tags) ? node.tags.join(', ') : node.tags;
    const excelRow = [...currentRow, currentId, currentTags, node.testDescription];
    return [excelRow];
  }

  let rows = [];

  if (node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const childRows = mindDataToExcelDataTestNode(childNode, currentRow);
      rows = rows.concat(childRows);
    }
  }

  return rows;
}

export const mindDataToExcelDataAutoFill = (node) => {
  const testRows = mindDataToExcelDataTestNode(node);
  const maxColumns = Math.max(...testRows.map(row => row.length));

  const rows = testRows.map(row => {
    const missingColumns = maxColumns - row.length;
    if (missingColumns > 0) {
      const padding = new Array(missingColumns).fill('');
      return [...row.slice(0, -4), ...padding, ...row.slice(-4)];
    }
    return row;
  });

  let headers = ['Scenario', 'Test Title', 'Test ID', 'Test Tags', 'Test Description'];
  const emptyArray = Array(maxColumns - headers.length).fill('');
  headers = [...headers.slice(0,1), ...emptyArray, ...headers.slice(-4)];


  return { scenarioColumnCount: emptyArray.length + 1, excelData: [headers, ...rows] };
};

export const createAndDownloadExcel = (nodeData, rootNodeTopic) => {
  const { scenarioColumnCount, excelData } = mindDataToExcelDataAutoFill(nodeData);
  const filename = excelFilename(rootNodeTopic);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: scenarioColumnCount - 1 } };
  ws['!merges'] = [mergeRange];

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};
