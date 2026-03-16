import { useMemo, useState } from 'react'
import { supabase } from '../supabase'
import { useToast } from '../context/ToastContext'
import { Icon } from './Icons'
import { parseFilePreview } from '../features/product-import/parsing'
import { executeProductImport } from '../features/product-import/execution'
import {
  buildDefaultColumnMappings,
  SKIP_PROPERTY,
  SYSTEM_PROPERTY_OPTIONS,
} from '../features/product-import/schema'

function fileExtension(fileName) {
  const parts = String(fileName || '').toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function isSupportedFile(fileName) {
  return ['csv', 'xlsx', 'xls'].includes(fileExtension(fileName))
}

const initialSummary = {
  totalRows: 0,
  inserted: 0,
  updated: 0,
  skipped: 0,
  failed: 0,
  errors: [],
}

export default function ProductBulkImportModal({ open, onClose, onImported }) {
  const { show } = useToast()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [columnMapping, setColumnMapping] = useState({})
  const [parsing, setParsing] = useState(false)
  const [importing, setImporting] = useState(false)
  const [summary, setSummary] = useState(initialSummary)

  const mappedCount = useMemo(() => {
    return Object.values(columnMapping).filter((item) => item?.targetField !== SKIP_PROPERTY).length
  }, [columnMapping])

  const resetState = () => {
    setStep(1)
    setFile(null)
    setPreview(null)
    setColumnMapping({})
    setParsing(false)
    setImporting(false)
    setSummary(initialSummary)
  }

  const closeModal = () => {
    resetState()
    onClose?.()
  }

  const handleFileChange = async (event) => {
    const selected = event.target.files?.[0]
    if (!selected) return

    if (!isSupportedFile(selected.name)) {
      show('Unsupported file type. Please upload CSV or Excel.', 'error')
      return
    }

    setParsing(true)
    try {
      const filePreview = await parseFilePreview(selected)
      if (!filePreview.headers.length) {
        throw new Error('No columns found in uploaded file.')
      }

      setFile(selected)
      setPreview(filePreview)
      setColumnMapping(buildDefaultColumnMappings(filePreview.headers))
      setStep(2)
    } catch (error) {
      show(error.message || 'Failed to read uploaded file.', 'error')
    } finally {
      setParsing(false)
    }
  }

  const updateMapping = (header, updates) => {
    setColumnMapping((current) => ({
      ...current,
      [header]: {
        ...current[header],
        ...updates,
      },
    }))
  }

  const importData = async () => {
    if (!file || !preview) return

    if (mappedCount === 0) {
      show('Map at least one column before importing.', 'error')
      return
    }

    setImporting(true)
    try {
      const result = await executeProductImport({
        supabaseClient: supabase,
        file,
        columnMapping,
      })

      setSummary(result)
      setStep(3)
      onImported?.(result)

      if (result.failed === 0) {
        show(`Import completed. ${result.inserted} inserted, ${result.updated} updated.`, 'success')
      } else {
        show(`Import finished with ${result.failed} failed rows.`, 'info')
      }
    } catch (error) {
      show(error.message || 'Import failed.', 'error')
    } finally {
      setImporting(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={(event) => event.target === event.currentTarget && closeModal()}>
      <div className="modal modal--xl">
        <div className="modal-header">
          <div>
            <h2 className="admin-modal-title">استيراد منتجات الأما،</h2>
            <p className="admin-modal-subtitle">خطوة {step} من 3</p>
          </div>
          <button className="btn btn-sm btn-secondary" onClick={closeModal}>
            <Icon name="x" size={14} />
          </button>
        </div>

        <div className="modal-body">
          <div className="admin-chip-row">
            <span className={`badge ${step === 1 ? 'badge-yellow' : 'badge-gray'}`}>1. تحليل الملف</span>
            <span className={`badge ${step === 2 ? 'badge-yellow' : 'badge-gray'}`}>2. تمابل الأعمدة</span>
            <span className={`badge ${step === 3 ? 'badge-yellow' : 'badge-gray'}`}>3. التنفيذ</span>
          </div>

          {step === 1 ? (
            <div className="card">
              <div className="admin-card-head">
                <div className="admin-card-head__copy">
                  <div className="admin-heading-sm">رفع الملف</div>
                  <div className="admin-meta">رفع CSV/Excel. سيقوم النظام بتحليل رؤوس الأعمدة وأول صف بيانات فقط في هذه المرحلة.</div>
                </div>
              </div>

              <input
                type="file"
                className="input"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={parsing}
              />

              <div className="admin-inline-note">المدعوم: <code>.csv</code>, <code>.xlsx</code>, <code>.xls</code></div>

              {parsing ? (
                <div className="admin-spinner-inline">
                  <div className="spinner spinner--xs" />
                  جاري تحليل معاينة الملف...
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 2 && preview ? (
            <>
              <div className="card">
                <div className="admin-summary-row">
                  <div className="admin-meta"><strong>File:</strong> {file?.name}</div>
                  <div className="admin-meta"><strong>Columns:</strong> {preview.headers.length}</div>
                  <div className="admin-meta"><strong>Estimated Rows:</strong> {preview.estimatedDataRows}</div>
                </div>
              </div>

              <div className="table-wrap admin-table-panel">
                <table>
                  <thead>
                    <tr>
                      <th>اسم العمود في الملف المستورد</th>
                      <th>خاصية نظام</th>
                      <th>مثال قيمة مستوردة</th>
                      <th>معدل (اختياري)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.headers.map((header) => (
                      <tr key={header}>
                        <td><code className="admin-code">{header}</code></td>
                        <td>
                          <select
                            className="input"
                            value={columnMapping[header]?.targetField || SKIP_PROPERTY}
                            onChange={(event) => updateMapping(header, { targetField: event.target.value })}
                          >
                            {SYSTEM_PROPERTY_OPTIONS.map((option) => (
                              <option key={option.key} value={option.key}>{option.label}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div className="admin-table-sub admin-table-clamp">{String(preview.sampleRow[header] ?? '') || '-'}</div>
                        </td>
                        <td>
                          <input
                            className="input"
                            placeholder="ex: +10 | ucfirst"
                            value={columnMapping[header]?.modifier || ''}
                            onChange={(event) => updateMapping(header, { modifier: event.target.value })}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-inline-note">
                أمثلة معدل: <code>+10</code>, <code>*1.15</code>, <code>trim</code>, <code>ucfirst</code>, <code>upper</code>, <code>lower</code>.
                استخدم <code>|</code> لربط معدلات متعددة.
              </div>
              <div className="admin-field-note">
                لتحديث منتجات موجودة، ربط عمود ملف بـ <code>رقم المنتج للتحديث</code>.
              </div>

              <div className="admin-split">
                <span className="admin-meta">{mappedCount} مظروب / {preview.headers.length} الأعمدة بالكامل</span>
                <button className="btn btn-primary" onClick={importData} disabled={importing}>
                  {importing ? (
                    <>
                      <div className="spinner spinner--xs" />
                      جاري الاستيراد...
                    </>
                  ) : (
                    <>
                      <Icon name="upload" size={14} />
                      استيراد البيانات
                    </>
                  )}
                </button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <div className="card">
              <div className="admin-card-head">
                <div className="admin-card-head__copy">
                  <div className="admin-heading-sm">ملخص الاستيراد</div>
                  <div className="admin-meta">ملخص التنفيذ النهايئي وحالة الصفوف المستوردة.</div>
                </div>
              </div>

              <div className="admin-summary-grid">
                <div className="badge badge-blue admin-table-badge">الصفوف: {summary.totalRows}</div>
                <div className="badge badge-green admin-table-badge">تم الإدراج: {summary.inserted}</div>
                <div className="badge badge-yellow admin-table-badge">تم التحديث: {summary.updated}</div>
                <div className="badge badge-red admin-table-badge">فشل: {summary.failed}</div>
              </div>

              <div className="admin-inline-note">الصفوف المقفولة (راغمة بعد التعيين): {summary.skipped}</div>

              {summary.errors.length > 0 ? (
                <div className="admin-card-section">
                  <div className="admin-section-title">بيانات الأخطاء (أول 20)</div>
                  <div className="admin-scroll-panel">
                    {summary.errors.slice(0, 20).map((error, index) => (
                      <div key={`${error.rowNumber}-${index}`} className="admin-table-sub">
                        الصف {error.rowNumber}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="modal-footer admin-modal-actions-spread">
          <button className="btn btn-secondary" onClick={closeModal}>إغلاق</button>
          {step > 1 && step < 3 ? (
            <button className="btn btn-secondary" onClick={() => setStep((current) => current - 1)} disabled={importing}>
              رجوع
            </button>
          ) : null}
          {step === 3 ? (
            <button className="btn btn-primary" onClick={closeModal}>
              <Icon name="check" size={14} />
              Done
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
