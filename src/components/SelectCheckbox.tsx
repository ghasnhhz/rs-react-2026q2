'use client';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { toggleItem } from '../store/slices/selectedItemsSlice';
import type { Season } from '../types/season';

interface SelectCheckboxProps {
  season: Season;
}

function SelectCheckbox({ season }: SelectCheckboxProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isSelected = useSelector((state: RootState) =>
    state.selectedItems.items.some((item) => item.uid === season.uid)
  );

  return (
    <input
      type="checkbox"
      className="card-checkbox"
      checked={isSelected}
      onChange={() => dispatch(toggleItem(season))}
      aria-label={`Select ${season.title}`}
    />
  );
}

export default SelectCheckbox;
