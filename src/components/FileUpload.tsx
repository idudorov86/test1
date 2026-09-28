import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFile: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function FileUpload({ onFile, loading, error }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      const validExt = /\.(xlsx|xls)$/i.test(file.name);
      if (!validExt) return;
      onFile(file);
    },
    [onFile]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          📊 Дашборд аналитики отчетов УВПК
        </h1>
        <p className="text-slate-500 mb-8">
          Загрузите Excel-отдел продаж — данные обрабатываются локально в браузере
        </p>

        <div
          className={`border-2 border-dashed rounded-2xl p-12 transition-colors cursor-pointer
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400'}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
        >
          {loading ? (
            <>
              <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <p className="text-slate-600 font-medium">Обработка файла...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-slate-700 font-semibold text-lg mb-1">
                Перетащите файл сюда
              </p>
              <p className="text-slate-400 mb-4">или нажмите для выбора</p>
              <span className="inline-flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Поддерживаются форматы .xlsx, .xls
              </span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
