import { useState, useEffect, useMemo, useCallback } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import type { BookingData } from '@/types/api';
import { LocalStorage } from '@/lib/storage';

export const [BookingProvider, useBooking] = createContextHook(() => {
  const [bookingData, setBookingDataState] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = async () => {
    try {
      const data = await LocalStorage.getBooking();
      setBookingDataState(data);
    } catch (error) {
      console.error('Erro ao carregar dados da reserva:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setBookingData = useCallback(async (data: BookingData | null) => {
    if (!data && data !== null) return;
    
    try {
      if (data) {
        const validatedData = {
          ...data,
          bookingCode: data.bookingCode?.trim() || '',
          guestName: data.guestName?.trim() || '',
        };
        await LocalStorage.setBooking(validatedData);
        setBookingDataState(validatedData);
      } else {
        await LocalStorage.setBooking(null);
        setBookingDataState(null);
      }
    } catch (error) {
      console.error('Erro ao salvar dados da reserva:', error);
    }
  }, []);

  const clearBookingData = useCallback(async () => {
    try {
      await LocalStorage.clearAll();
      setBookingDataState(null);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }, []);

  return useMemo(() => ({
    bookingData,
    setBookingData,
    clearBookingData,
    isLoading,
  }), [bookingData, setBookingData, clearBookingData, isLoading]);
});