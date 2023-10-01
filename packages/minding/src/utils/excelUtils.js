import { idToTestId } from "@/utils/commonUtils";
import XLSX from "xlsx";

const excelFilename = (rootNodeName) => {
  return `${rootNodeName}.xlsx`;
};

const isTestTagsFulfilled = (testTags, filterTags) => {
  // refer to not enabled.
  if (filterTags === null) {
    return true;
  }

  // otherwise enable and check the filter.
  return filterTags.every(filterTag => testTags.includes(filterTag));
};

/**
 * filters = {
 *   testTags: ['regression', 'smoke', ...]
 * }
 * */
const mindDataToExcelDataTestNode = (node, parentTopics = [],
                                     filters={ testTags: null }) => {
  const currentTopic = node.topic;
  const currentRow = [...parentTopics, currentTopic];

  if (node.nodeType === 'test' && isTestTagsFulfilled(node.tags, filters.testTags)) {
    const currentId = idToTestId(node.id);
    const currentTags = Array.isArray(node.tags) ? node.tags.join(', ') : node.tags;
    const excelRow = [...currentRow, currentId, currentTags, node.testDescription];
    return [excelRow];
  }

  let rows = [];

  if (node.children && node.children.length > 0) {
    for (const childNode of node.children) {
      const childRows = mindDataToExcelDataTestNode(childNode, currentRow, filters);
      rows = rows.concat(childRows);
    }
  }

  return rows;
}

const mindDataToExcelDataAutoFill = (node, filters) => {
  const testRows = mindDataToExcelDataTestNode(node, [], filters);
  if (testRows.length === 0) {
    return { scenarioColumnCount: 0, excelData: [] };
  }

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

export const createAndDownloadExcelOfAllTestEndingNodes = (nodeData,
                                                           rootNodeTopic,
                                                           alignColumns=false,
                                                           filters
                                                           ) => {
  let wb, ws;
  if (alignColumns) {
    const excelDataAutoFilled = mindDataToExcelDataAutoFill(nodeData, filters);

    wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet(excelDataAutoFilled.excelData);

    if (excelDataAutoFilled.scenarioColumnCount > 0) {
        const mergeRange = { s: { r: 0, c: 0 }, e: { r: 0, c: excelDataAutoFilled.scenarioColumnCount - 1 } };
        ws['!merges'] = [mergeRange];
    }

  } else {
    const excelData = mindDataToExcelDataTestNode(nodeData, [], filters);
    wb = XLSX.utils.book_new();
    ws = XLSX.utils.aoa_to_sheet(excelData);
  }

  const filename = excelFilename(rootNodeTopic);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};

const mindDataToExcelDataAllEndingNodes = (nodeData, result = [], currentRow = []) => {
  if (nodeData) {
    currentRow.push(nodeData.topic);

    if (nodeData.children && nodeData.children.length > 0) {
      for (const child of nodeData.children) {
        mindDataToExcelDataAllEndingNodes(child, result, currentRow.slice());
      }
    } else {
      result.push(currentRow);
    }
  }

  return result;
}

export const createAndDownloadExcelOfAllEndingNodes = (nodeData, rootNodeTopic) => {
  const excelData = mindDataToExcelDataAllEndingNodes(nodeData);
  const filename = excelFilename(rootNodeTopic);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, filename);
};
