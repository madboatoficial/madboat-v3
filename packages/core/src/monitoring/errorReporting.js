/**
 * Error Reporting and Monitoring Integration
 * Ready for Sentry, LogRocket, or custom monitoring solutions
 */
class ErrorReportingService {
    constructor(config) {
        this.isInitialized = false;
        this.config = config;
        this.sessionId = this.generateSessionId();
    }
    /**
     * Initialize monitoring service (Sentry, LogRocket, etc.)
     */
    initialize() {
        if (this.isInitialized)
            return;
        try {
            // Future: Initialize Sentry
            // Sentry.init({
            //   dsn: this.config.dsn,
            //   environment: this.config.environment,
            //   tracesSampleRate: this.config.sampleRate || 1.0,
            //   replaysSessionSampleRate: this.config.enableReplay ? 0.1 : 0,
            //   replaysOnErrorSampleRate: this.config.enableReplay ? 1.0 : 0,
            // })
            // Future: Initialize LogRocket
            // LogRocket.init('app-id')
            this.isInitialized = true;
            console.log('🔍 Monitoring service initialized');
        }
        catch (error) {
            console.warn('Failed to initialize monitoring service:', error);
        }
    }
    /**
     * Report error to monitoring service
     */
    reportError(error, additionalContext) {
        const errorReport = {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
            url: typeof window !== 'undefined' ? window.location.href : 'server',
            userId: this.config.userId,
            sessionId: this.sessionId,
            environment: this.config.environment,
            buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
            additionalContext,
        };
        // Log to console in development
        if (this.config.environment === 'development') {
            console.error('🚨 Error Report:', errorReport);
        }
        try {
            // Future: Send to Sentry
            // Sentry.captureException(error, {
            //   contexts: {
            //     session: {
            //       sessionId: this.sessionId,
            //       userId: this.config.userId,
            //     },
            //     additional: additionalContext,
            //   },
            // })
            // Future: Send to LogRocket
            // LogRocket.captureException(error)
            // Store locally for now (can be sent to custom endpoint)
            this.storeErrorLocally(errorReport);
        }
        catch (reportingError) {
            console.error('Failed to report error:', reportingError);
        }
    }
    /**
     * Report performance metrics
     */
    reportPerformance(name, duration, additionalData) {
        if (!this.config.enablePerformanceMonitoring)
            return;
        const performanceData = {
            name,
            duration,
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            url: typeof window !== 'undefined' ? window.location.href : 'server',
            additionalData,
        };
        try {
            // Future: Send to monitoring service
            // Sentry.addBreadcrumb({
            //   message: `Performance: ${name}`,
            //   level: 'info',
            //   data: performanceData,
            // })
            // Log in development
            if (this.config.environment === 'development') {
                console.log('📊 Performance:', performanceData);
            }
        }
        catch (error) {
            console.warn('Failed to report performance:', error);
        }
    }
    /**
     * Set user context for error reporting
     */
    setUser(userId, email, additional) {
        this.config.userId = userId;
        try {
            // Future: Set Sentry user
            // Sentry.setUser({
            //   id: userId,
            //   email,
            //   ...additional,
            // })
            // Future: Set LogRocket user
            // LogRocket.identify(userId, {
            //   email,
            //   ...additional,
            // })
        }
        catch (error) {
            console.warn('Failed to set user context:', error);
        }
    }
    /**
     * Add breadcrumb for debugging
     */
    addBreadcrumb(message, category, data) {
        try {
            // Future: Sentry breadcrumb
            // Sentry.addBreadcrumb({
            //   message,
            //   category: category || 'custom',
            //   level: 'info',
            //   data,
            // })
            // Log in development
            if (this.config.environment === 'development') {
                console.log('🍞 Breadcrumb:', { message, category, data });
            }
        }
        catch (error) {
            console.warn('Failed to add breadcrumb:', error);
        }
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    storeErrorLocally(errorReport) {
        if (typeof window === 'undefined')
            return;
        try {
            const errors = JSON.parse(localStorage.getItem('madboat_errors') || '[]');
            errors.push(errorReport);
            // Keep only last 50 errors
            if (errors.length > 50) {
                errors.splice(0, errors.length - 50);
            }
            localStorage.setItem('madboat_errors', JSON.stringify(errors));
        }
        catch (error) {
            console.warn('Failed to store error locally:', error);
        }
    }
}
// Global instance
let errorReportingService = null;
/**
 * Initialize global error reporting
 */
export function initializeErrorReporting(config) {
    errorReportingService = new ErrorReportingService(config);
    errorReportingService.initialize();
    // Set up global error handlers
    if (typeof window !== 'undefined') {
        window.addEventListener('error', (event) => {
            errorReportingService?.reportError(new Error(event.message), {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
            });
        });
        window.addEventListener('unhandledrejection', (event) => {
            errorReportingService?.reportError(new Error(`Unhandled Promise Rejection: ${event.reason}`), { type: 'unhandledrejection' });
        });
    }
}
/**
 * Get global error reporting instance
 */
export function getErrorReporting() {
    return errorReportingService;
}
/**
 * Performance measurement decorator
 */
export function measurePerformance(name, fn) {
    return ((...args) => {
        const start = performance.now();
        const result = fn(...args);
        if (result instanceof Promise) {
            return result.finally(() => {
                const duration = performance.now() - start;
                errorReportingService?.reportPerformance(name, duration);
            });
        }
        else {
            const duration = performance.now() - start;
            errorReportingService?.reportPerformance(name, duration);
            return result;
        }
    });
}
