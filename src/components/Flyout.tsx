import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { clearItems } from '../store/slices/selectedItemsSlice';
import type { Season } from '../types/season';
import './Flyout.css';

function convertToCSV(items: Season[]): string {
  const headers = ['Title', 'Series', 'Season Number', 'Episodes', 'Details URL'];
  const rows = items.map((item) => [
    `"${item.title.replace(/"/g, '""')}"`,
    `"${item.series.title.replace(/"/g, '""')}"`,
    item.seasonNumber || '',
    item.numberOfEpisodes || 'N/A',
    `https://stapi.co/api/v1/rest/season?uid=${item.uid}`,
  ]);

  return [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
}

function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function Flyout() {
  const dispatch = useDispatch<AppDispatch>();
  const selectedItems = useSelector((state: RootState) => state.selectedItems.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearItems());
  };

  const handleDownload = () => {
    const csv = convertToCSV(selectedItems);
    downloadCSV(csv, `${selectedItems.length}_items.csv`);
  };

  return (
    <div className="flyout">
      <div className="flyout-content">
        <span className="flyout-count">
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </span>
        <div className="flyout-actions">
          <button
            type="button"
            className="flyout-button flyout-button--unselect"
            onClick={handleUnselectAll}
          >
            Unselect All
          </button>
          <button
            type="button"
            className="flyout-button flyout-button--download"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

export default Flyout;