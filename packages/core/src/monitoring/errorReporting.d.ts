/**
 * Error Reporting and Monitoring Integration
 * Ready for Sentry, LogRocket, or custom monitoring solutions
 */
export interface ErrorReport {
    message: string;
    stack?: string;
    componentStack?: string;
    timestamp: string;
    userAgent: string;
    url: string;
    userId?: string;
    sessionId?: string;
    environment: string;
    buildVersion?: string;
    additionalContext?: Record<string, any>;
}
export interface MonitoringConfig {
    dsn?: string;
    environment: 'development' | 'staging' | 'production';
    sampleRate?: number;
    userId?: string;
    enablePerformanceMonitoring?: boolean;
    enableReplay?: boolean;
}
declare class ErrorReportingService {
    private config;
    private sessionId;
    private isInitialized;
    constructor(config: MonitoringConfig);
    /**
     * Initialize monitoring service (Sentry, LogRocket, etc.)
     */
    initialize(): void;
    /**
     * Report error to monitoring service
     */
    reportError(error: Error, additionalContext?: Record<string, any>): void;
    /**
     * Report performance metrics
     */
    reportPerformance(name: string, duration: number, additionalData?: Record<string, any>): void;
    /**
     * Set user context for error reporting
     */
    setUser(userId: string, email?: string, additional?: Record<string, any>): void;
    /**
     * Add breadcrumb for debugging
     */
    addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void;
    private generateSessionId;
    private storeErrorLocally;
}
/**
 * Initialize global error reporting
 */
export declare function initializeErrorReporting(config: MonitoringConfig): void;
/**
 * Get global error reporting instance
 */
export declare function getErrorReporting(): ErrorReportingService | null;
/**
 * Performance measurement decorator
 */
export declare function measurePerformance<T extends (...args: any[]) => any>(name: string, fn: T): T;
export {};
