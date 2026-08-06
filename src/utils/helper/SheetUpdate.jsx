import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

const SCOPES = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';

const SAMPLE_TODOS = [
  { title: 'Setup Authentication', status: 'Done', priority: 'High' },
  { title: 'Design 10x10 Layout', status: 'Done', priority: 'Medium' },
  { title: 'Integrate Google API', status: 'Done', priority: 'High' },
  { title: 'Add Color Formatting', status: 'Done', priority: 'Low' },
  { title: 'Embed Chart View', status: 'Done', priority: 'Medium' },
  { title: 'Refactor Codebase', status: 'Pending', priority: 'High' },
  { title: 'Write Unit Tests', status: 'Pending', priority: 'Low' },
  { title: 'Optimize Build Size', status: 'Pending', priority: 'Medium' },
  { title: 'Deploy to Production', status: 'Pending', priority: 'High' },
  { title: 'User Feedback Review', status: 'Pending', priority: 'Low' },
];

export default function SheetUpdate() {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    scope: SCOPES,
    onSuccess: async (tokenResponse) => {
      if (tokenResponse.access_token) {
        await createColorfulSheetWithCharts(tokenResponse.access_token);
      }
    },
    onError: (err) => {
      console.error('OAuth Error:', err);
      setLoading(false);
    },
  });

  const createColorfulSheetWithCharts = async (accessToken) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Create Spreadsheet
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: { title: `Colorful Dashboard - ${today}` },
        }),
      });

      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const sheetId = sheetData.sheets[0].properties.sheetId;

      // 2. Prepare Data Values
      const headers = ['ID', 'Task Name', 'Category', 'Priority', 'Status', 'Assignee', 'Est Hours', 'Cost ($)', 'Progress %', 'Notes'];

      const dataRows = Array.from({ length: 10 }, (_, i) => {
        const todo = SAMPLE_TODOS[i] || { title: `Task ${i + 1}`, status: 'Pending', priority: 'Medium' };
        return [
          `TSK-10${i + 1}`,
          todo.title,
          i % 2 === 0 ? 'Engineering' : 'Design',
          todo.priority,
          todo.status,
          `Developer ${i + 1}`,
          (i + 1) * 2,
          (i + 1) * 50,
          todo.status === 'Done' ? '100%' : '25%',
          'Colored Row Entry',
        ];
      });

      const doneCount = SAMPLE_TODOS.filter((t) => t.status === 'Done').length;
      const pendingCount = SAMPLE_TODOS.length - doneCount;

      const highCount = SAMPLE_TODOS.filter((t) => t.priority === 'High').length;
      const medCount = SAMPLE_TODOS.filter((t) => t.priority === 'Medium').length;
      const lowCount = SAMPLE_TODOS.filter((t) => t.priority === 'Low').length;

      const fullValues = [
        headers,
        ...dataRows,
        [], 
        ['Status', 'Count'],      // Row 13 (index 12)
        ['Done', doneCount],      // Row 14 (index 13)
        ['Pending', pendingCount],// Row 15 (index 14)
        [], 
        ['Priority', 'Count'],    // Row 17 (index 16)
        ['High', highCount],      // Row 18 (index 17)
        ['Medium', medCount],     // Row 19 (index 18)
        ['Low', lowCount],        // Row 20 (index 19)
      ];

      // 3. Populate Sheet Values
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ values: fullValues }),
        }
      );

      // 4. STEP 1: Apply Formatting & Cell Colors
      const styleRequests = [
        {
          repeatCell: {
            range: { sheetId, startRowIndex: 0, endRowIndex: 1, startColumnIndex: 0, endColumnIndex: 10 },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.1, green: 0.2, blue: 0.45 },
                textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
                horizontalAlignment: 'CENTER',
              },
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)',
          },
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 11, startColumnIndex: 3, endColumnIndex: 4 }],
              booleanRule: {
                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'High' }] },
                format: {
                  backgroundColor: { red: 1.0, green: 0.8, blue: 0.8 },
                  textFormat: { foregroundColor: { red: 0.7, green: 0, blue: 0 }, bold: true },
                },
              },
            },
            index: 0,
          },
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 11, startColumnIndex: 3, endColumnIndex: 4 }],
              booleanRule: {
                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Medium' }] },
                format: {
                  backgroundColor: { red: 1.0, green: 0.95, blue: 0.7 },
                  textFormat: { foregroundColor: { red: 0.6, green: 0.4, blue: 0 }, bold: true },
                },
              },
            },
            index: 1,
          },
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 11, startColumnIndex: 3, endColumnIndex: 4 }],
              booleanRule: {
                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Low' }] },
                format: {
                  backgroundColor: { red: 0.8, green: 0.9, blue: 1.0 },
                  textFormat: { foregroundColor: { red: 0.1, green: 0.3, blue: 0.7 }, bold: true },
                },
              },
            },
            index: 2,
          },
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [{ sheetId, startRowIndex: 1, endRowIndex: 11, startColumnIndex: 4, endColumnIndex: 5 }],
              booleanRule: {
                condition: { type: 'TEXT_EQ', values: [{ userEnteredValue: 'Done' }] },
                format: {
                  backgroundColor: { red: 0.8, green: 0.95, blue: 0.8 },
                  textFormat: { foregroundColor: { red: 0.1, green: 0.5, blue: 0.2 }, bold: true },
                },
              },
            },
            index: 3,
          },
        },
        {
          autoResizeDimensions: {
            dimensions: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 10 },
          },
        },
      ];

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests: styleRequests }),
      });

      // 5. STEP 2: Embed Column & Pie Charts
      const chartRequests = [
        {
          addChart: {
            chart: {
              spec: {
                title: 'Task Status Overview',
                basicChart: {
                  chartType: 'COLUMN',
                  legendPosition: 'NO_LEGEND',
                  domains: [
                    {
                      domain: {
                        sourceRange: {
                          sources: [{ sheetId, startRowIndex: 13, endRowIndex: 15, startColumnIndex: 0, endColumnIndex: 1 }],
                        },
                      },
                    },
                  ],
                  series: [
                    {
                      series: {
                        sourceRange: {
                          sources: [{ sheetId, startRowIndex: 13, endRowIndex: 15, startColumnIndex: 1, endColumnIndex: 2 }],
                        },
                      },
                      targetAxis: 'LEFT_AXIS',
                    },
                  ],
                },
              },
              position: {
                overlayPosition: {
                  anchorCell: { sheetId, rowIndex: 1, columnIndex: 11 },
                },
              },
            },
          },
        },
        {
          addChart: {
            chart: {
              spec: {
                title: 'Priority Distribution',
                pieChart: {
                  legendPosition: 'RIGHT_LEGEND',
                  threeD: true,
                  domain: {
                    sourceRange: {
                      sources: [{ sheetId, startRowIndex: 17, endRowIndex: 20, startColumnIndex: 0, endColumnIndex: 1 }],
                    },
                  },
                  series: {
                    sourceRange: {
                      sources: [{ sheetId, startRowIndex: 17, endRowIndex: 20, startColumnIndex: 1, endColumnIndex: 2 }],
                    },
                  },
                },
              },
              position: {
                overlayPosition: {
                  anchorCell: { sheetId, rowIndex: 16, columnIndex: 11 },
                },
              },
            },
          },
        },
      ];

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests: chartRequests }),
      });

      window.open(`https://docs.google.com/spreadsheets/d/${spreadsheetId}`, '_blank');
    } catch (err) {
      console.error('Error creating Google Sheet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-2xl border border-slate-800">
      <h2 className="text-xl font-bold mb-2">Export Colored 10x10 Sheet with Charts</h2>
      <button
        onClick={() => {
          setLoading(true);
          login();
        }}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 font-semibold px-6 py-3 rounded-xl shadow-lg transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? 'Generating Sheet...' : 'Export Colored Sheet with Charts'}
      </button>
    </div>
  );
}