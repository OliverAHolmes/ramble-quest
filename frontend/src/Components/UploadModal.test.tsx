import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UploadModal from './UploadModal';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

// Mock the Redux store
const mockStore = configureStore([]);
let store: any;

// Mock the fetch function
global.fetch = jest.fn();

const customRender = () => {
  return render(
    <Provider store={store}>
      <UploadModal />
    </Provider>
  );
};

describe('UploadModal', () => {
  beforeEach(() => {
    store = mockStore({
      panels: {
        uploadGeoJson: {
          visible: true,  // set this to true
        },
      },
    });
  
    store.dispatch = jest.fn();

  });  

  it('renders without crashing', () => {
    customRender();
    expect(screen.getByText(/GeoJSON Upload/i)).toBeInTheDocument();
  });

  it('calls handleCancelButtClick when the Cancel button is clicked', () => {
    customRender();
    const cancelButton = screen.getByText(/Cancel/i);
    userEvent.click(cancelButton);
    expect(store.dispatch).toHaveBeenCalledWith(expect.anything()); // replace with your expected action
  });

  it('displays UploadError when an error occurs', async () => {
    customRender();
    // Prepare mocked fetch response
    const mockedFetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'File upload failed' }),
      })
    );
    (global.fetch as unknown as typeof mockedFetch) = mockedFetch;

    // Upload button
    const uploadButton = screen.getByTestId('upload-button');
    
    // Mock file input
    const input = screen.getByTestId('file-input');
    const file = new File(['file'], 'file.geojson', { type: 'application/geo+json' });
    userEvent.upload(input, file);

    // eslint-disable-next-line 
    await act(async () => {
      userEvent.click(uploadButton);
    });

    expect(screen.getByText(/Error/i)).toBeInTheDocument();
    expect(screen.getByText(/File upload failed/i)).toBeInTheDocument();
  });
});
