'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useTranslations } from 'next-intl';
import type { RootState, AppDispatch } from '../store/store';
import { clearItems } from '../store/slices/selectedItemsSlice';
import './Flyout.css';

function Flyout() {
  const t = useTranslations('Flyout');
  const dispatch = useDispatch<AppDispatch>();
  const selectedItems = useSelector((state: RootState) => state.selectedItems.items);

  if (selectedItems.length === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearItems());
  };

  return (
    <div className="flyout">
      <div className="flyout-content">
        <span className="flyout-count">{t('selected', { count: selectedItems.length })}</span>
        <div className="flyout-actions">
          <button
            type="button"
            className="flyout-button flyout-button--unselect"
            onClick={handleUnselectAll}
          >
            {t('unselectAll')}
          </button>
          <form method="post" action="/api/csv">
            <input type="hidden" name="items" value={JSON.stringify(selectedItems)} />
            <button type="submit" className="flyout-button flyout-button--download">
              {t('download')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Flyout;
