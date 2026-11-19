import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fetchHealth } from '../lib/api';

type Status =
  { kind: 'loading' } | { kind: 'ok'; version: string } | { kind: 'error' };

export function ServerStatus() {
  const [status, setStatus] = useState<Status>({ kind: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((health) => setStatus({ kind: 'ok', version: health.version }))
      .catch(() => {
        if (!controller.signal.aborted) setStatus({ kind: 'error' });
      });
    return () => controller.abort();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>B2B Chat</Text>
      <Text>{describe(status)}</Text>
    </View>
  );
}

function describe(status: Status): string {
  switch (status.kind) {
    case 'loading':
      return 'Đang kết nối máy chủ…';
    case 'ok':
      return `Máy chủ hoạt động (phiên bản ${status.version})`;
    case 'error':
      return 'Không kết nối được máy chủ';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
